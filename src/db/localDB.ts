import Dexie, { type Table } from 'dexie';

export interface Patient {
  id?: number;
  localId: string;
  name: string;
  age: number;
}

export interface DetectionDetail {
  bbox: [number, number, number, number];
  class: string;
  confidence: number;
}

export interface Diagnosis {
  id?: number;
  patientLocalId: string;
  date: string;
  parasiteFound: string;
  confidence: number;
  isSynced: boolean;
  detectedParasitesCount?: number;
  imgURL?: string;
  detections?: DetectionDetail[];
}

export interface DetectionFrame {
  id?: number;
  diagnosisId: number;
  imageBlob: Blob;
  thumbnailBlob?: Blob;
  fileName?: string;
}

export type SyncAction = 'CREATE' | 'CORRECT' | 'FALSE_POSITIVE' | 'RELABEL';
export type SyncStatus = 'PENDING' | 'FAILED' | 'SUCCESS';

export interface PendingSync {
  id?: number;
  diagnosisId: number;
  action?: SyncAction;
  payload?: Partial<Diagnosis>;
  timestamp?: string;
  retryCount: number;
  status?: SyncStatus;
}

export class ParasiteDB extends Dexie {
  patients!: Table<Patient, number>;
  diagnoses!: Table<Diagnosis, number>;
  detectionFrames!: Table<DetectionFrame, number>;
  pendingSyncs!: Table<PendingSync, number>;

  constructor() {
    super('ParasAIteDB');

    // Mantenemos la versión 1 y actualizamos a versión 2 con índices para búsquedas óptimas
    this.version(1).stores({
      patients: '++id, localId, name',
      diagnoses: '++id, patientLocalId, date, parasiteFound, isSynced',
      detectionFrames: '++id, diagnosisId',
      pendingSyncs: '++id, diagnosisId',
    });

    this.version(2).stores({
      patients: '++id, localId, name',
      diagnoses: '++id, patientLocalId, date, parasiteFound, isSynced',
      detectionFrames: '++id, diagnosisId',
      pendingSyncs: '++id, diagnosisId, status, action',
    });
  }
}

export const db = new ParasiteDB();
