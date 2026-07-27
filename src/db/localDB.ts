import Dexie, { type Table } from 'dexie';

export interface Patient {
  id?: number;
  localId: string;
  name: string;
  age: number;
}

export interface Diagnosis {
  id?: number;
  patientLocalId: string;
  date: string;
  parasiteFound: string;
  confidence: number;
  isSynced: boolean;
}

export interface DetectionFrame {
  id?: number;
  diagnosisId: number;
  imageBlob: Blob;
  thumbnailBlob?: Blob;
}

export interface PendingSync {
  id?: number;
  diagnosisId: number;
  retryCount: number;
}

export class ParasiteDB extends Dexie {
  patients!: Table<Patient, number>;
  diagnoses!: Table<Diagnosis, number>;
  detectionFrames!: Table<DetectionFrame, number>;
  pendingSyncs!: Table<PendingSync, number>;

  constructor() {
    super('ParasAIteDB');
    // Define índices de búsqueda. NO se colocan Blobs aquí para mantener alto rendimiento.
    this.version(1).stores({
      patients: '++id, localId, name',
      diagnoses: '++id, patientLocalId, date, parasiteFound, isSynced',
      detectionFrames: '++id, diagnosisId',
      pendingSyncs: '++id, diagnosisId',
    });
  }
}

export const db = new ParasiteDB();
