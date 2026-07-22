import { describe, it, expect } from 'vitest';
import { processMicroscopicSample } from '../workers/workerLogic';
import { recentAnalyses } from '../assets/constants';

describe('Worker Logic: Parasite Segmentation', () => {
  it('debe retornar un array vacío si no hay parásitos detectados', () => {
    const results = processMicroscopicSample(1920, 1080, []);
    expect(results).toHaveLength(0);
  });

  it('debe generar coordenadas válidas dentro de los límites de la imagen', () => {
    const width = 800;
    const height = 600;
    const mockParasites = [{ label: 'Ascaris', value: 90 }];

    for (let i = 0; i < 100; i++) {
      const results = processMicroscopicSample(width, height, mockParasites);
      const item = results[0];

      const x1 = item.box[0] * width;
      const y1 = item.box[1] * height;
      const x2 = item.box[2] * width;
      const y2 = item.box[3] * height;

      expect(x1).toBeGreaterThanOrEqual(0);
      expect(y1).toBeGreaterThanOrEqual(0);
      expect(x2).toBeLessThanOrEqual(width);
      expect(y2).toBeLessThanOrEqual(height);
    }
  });

  it('debe generar dimensiones de caja dentro del rango esperado', () => {
    const width = 1000;
    const height = 1000;
    const results = processMicroscopicSample(width, height, [{ label: 'Test', value: 100 }]);
    const item = results[0];

    // Calculamos el ancho real a partir de los límites normalizados
    const boxWidth = (item.box[2] - item.box[0]) * width;

    // En workerLogic asignas de manera fija boxWidth = 140
    expect(boxWidth).toBeGreaterThanOrEqual(100);
    expect(boxWidth).toBeLessThanOrEqual(200);
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
