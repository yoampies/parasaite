import { describe, it, expect } from 'vitest';
import { processMicroscopicSample } from '../workerLogic';
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
      const box = results[0];

      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y + box.height).toBeLessThanOrEqual(height);
    }
  });

  it('debe generar dimensiones de caja dentro del rango esperado', () => {
    const results = processMicroscopicSample(1000, 1000, [{ label: 'Test', value: 100 }]);
    const box = results[0];

    expect(box.width).toBeGreaterThanOrEqual(100);
    expect(box.width).toBeLessThanOrEqual(200);
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
