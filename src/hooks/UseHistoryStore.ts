import { create } from 'zustand';
import { db, type Diagnosis } from '../db/localDB';

interface HistoryState {
  history: Diagnosis[];
  searchQuery: string;
  selectedFrameBlob: Blob | null;
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  loadHistory: () => Promise<void>;
  saveDiagnosis: (
    diagnosisData: Omit<Diagnosis, 'id' | 'isSynced'>,
    imageFiles: Blob[]
  ) => Promise<number>;
  loadFrameForDiagnosis: (diagnosisId: number) => Promise<Blob | null>;
  loadAllFramesForDiagnosis: (diagnosisId: number) => Promise<any[]>;
  clearSelectedFrame: () => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  searchQuery: '',
  selectedFrameBlob: null,
  isLoading: false,

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  loadHistory: async () => {
    set({ isLoading: true });
    try {
      const allDiagnoses = await db.diagnoses.orderBy('date').reverse().toArray();
      set({ history: allDiagnoses });
    } catch (error) {
      console.error('Error al cargar el historial desde Dexie:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  saveDiagnosis: async (diagnosisData, imageFiles) => {
    return await db.transaction(
      'rw',
      [db.diagnoses, db.detectionFrames, db.pendingSyncs],
      async () => {
        const diagId = await db.diagnoses.add({
          ...diagnosisData,
          isSynced: false,
        });

        // Bucle para guardar TODAS las imágenes en Dexie
        for (let i = 0; i < imageFiles.length; i++) {
          await db.detectionFrames.add({
            diagnosisId: diagId,
            imageBlob: imageFiles[i],
            fileName: `muestra_${diagId}_frame_${i}.png`,
          });
        }

        await db.pendingSyncs.add({
          diagnosisId: diagId,
          action: 'CREATE',
          payload: diagnosisData,
          timestamp: new Date().toISOString(),
          retryCount: 0,
          status: 'PENDING',
        });

        const updatedHistory = await db.diagnoses.orderBy('date').reverse().toArray();
        set({ history: updatedHistory });

        return diagId;
      }
    );
  },

  loadFrameForDiagnosis: async (diagnosisId: number) => {
    try {
      const frame = await db.detectionFrames.where('diagnosisId').equals(diagnosisId).first();
      const blob = frame?.imageBlob || null;
      set({ selectedFrameBlob: blob });
      return blob;
    } catch (error) {
      console.error('Error al consultar el Blob de la imagen:', error);
      return null;
    }
  },

  loadAllFramesForDiagnosis: async (diagnosisId: number) => {
    try {
      const frames = await db.detectionFrames.where({ diagnosisId }).toArray();
      return frames;
    } catch (error) {
      console.error('Error al consultar todos los fotogramas del diagnóstico:', error);
      return [];
    }
  },

  clearSelectedFrame: () => set({ selectedFrameBlob: null }),
}));
