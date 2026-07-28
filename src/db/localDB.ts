import Dexie, { type Table } from 'dexie';

export interface Patient {
  id?: number;
  localId: string;
  name: string;
  age: number;
}

// Estructura de cada parásito individual detectado por YOLOv8
export interface DetectionDetail {
  bbox: [number, number, number, number]; // Coordenadas [x, y, ancho, alto]
  class: string; // Nombre de la especie (ej. "Ascaris lumbricoides")
  confidence: number; // Nivel de confianza (0.0 a 1.0)
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
  detections?: DetectionDetail[]; // <--- AQUÍ se persisten las detecciones de YOLO
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

    // Incrementamos la versión para Dexie si agregamos o modificamos la estructura
    this.version(1).stores({
      patients: '++id, localId, name',
      diagnoses: '++id, patientLocalId, date, parasiteFound, isSynced',
      detectionFrames: '++id, diagnosisId',
      pendingSyncs: '++id, diagnosisId',
    });
  }
}

export const db = new ParasiteDB();
