// logic.test.ts
import { describe, it, expect } from 'vitest';
import { calculateIoU, applyNMS, BoundingBoxCandidate } from '../workers/yoloUtils';
import { recentAnalyses } from '../assets/constants';

describe('YOLO Math Utils: Intersection over Union (IoU)', () => {
  it('debe retornar 1.0 para dos cajas perfectamente superpuestas', () => {
    const boxA = [0.1, 0.1, 0.5, 0.5];
    const boxB = [0.1, 0.1, 0.5, 0.5];
    expect(calculateIoU(boxA, boxB)).toBeCloseTo(1.0);
  });

  it('debe retornar 0.0 para dos cajas totalmente disjuntas', () => {
    const boxA = [0.0, 0.0, 0.2, 0.2];
    const boxB = [0.5, 0.5, 0.8, 0.8];
    expect(calculateIoU(boxA, boxB)).toBe(0);
  });

  it('debe calcular correctamente el solapamiento parcial', () => {
    // Caja 1: área = 1.0 (de 0 a 1)
    // Caja 2: área = 1.0 (de 0.5 a 1.5)
    // Intersección: de 0.5 a 1.0 (área = 0.25)
    // Unión: 1.0 + 1.0 - 0.25 = 1.75 -> IoU = 0.25 / 1.75 = ~0.1428
    const boxA = [0.0, 0.0, 1.0, 1.0];
    const boxB = [0.5, 0.5, 1.5, 1.5];
    expect(calculateIoU(boxA, boxB)).toBeCloseTo(0.1428, 3);
  });
});

describe('YOLO Post-processing: Non-Maximum Suppression (NMS)', () => {
  it('debe filtrar cajas duplicadas sobre el mismo parásito quedándose con la de mayor confianza', () => {
    const mockCandidates: BoundingBoxCandidate[] = [
      { box: [0.1, 0.1, 0.4, 0.4], confidence: 0.95, classId: 0 }, // Ascaris principal
      { box: [0.11, 0.11, 0.41, 0.41], confidence: 0.82, classId: 0 }, // Duplicado de Ascaris
      { box: [0.7, 0.7, 0.9, 0.9], confidence: 0.88, classId: 1 }, // Otro parásito distante
    ];

    const filtered = applyNMS(mockCandidates, 0.45);

    expect(filtered).toHaveLength(2);
    expect(filtered[0].confidence).toBe(0.95);
    expect(filtered[1].confidence).toBe(0.88);
  });

  it('debe respetar el límite de maxDetections', () => {
    const mockCandidates: BoundingBoxCandidate[] = Array.from({ length: 30 }, (_, i) => ({
      box: [i * 0.02, i * 0.02, i * 0.02 + 0.05, i * 0.02 + 0.05],
      confidence: 0.9 - i * 0.01,
      classId: 0,
    }));

    const filtered = applyNMS(mockCandidates, 0.45, 10);
    expect(filtered.length).toBeLessThanOrEqual(10);
  });
});

describe('D3 Statistics: Content Generation', () => {
  it('debe calcular correctamente el promedio de confianza', () => {
    const analysis = recentAnalyses[0];
    const totalConfidence = analysis.detectedParasites.reduce((sum, p) => sum + p.value, 0);
    const avg = totalConfidence / analysis.detectedParasites.length;

    expect(Math.round(avg)).toBe(92);
  });
});
