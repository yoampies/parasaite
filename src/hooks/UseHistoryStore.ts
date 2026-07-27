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
    imageFile: Blob
  ) => Promise<number>;
  loadFrameForDiagnosis: (diagnosisId: number) => Promise<Blob | null>;
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

  saveDiagnosis: async (diagnosisData, imageFile) => {
    return await db.transaction(
      'rw',
      [db.diagnoses, db.detectionFrames, db.pendingSyncs],
      async () => {
        const diagId = await db.diagnoses.add({
          ...diagnosisData,
          isSynced: false,
        });

        await db.detectionFrames.add({
          diagnosisId: diagId,
          imageBlob: imageFile,
        });

        await db.pendingSyncs.add({
          diagnosisId: diagId,
          retryCount: 0,
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

  clearSelectedFrame: () => set({ selectedFrameBlob: null }),
}));
