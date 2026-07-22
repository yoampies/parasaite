// src/workers/workerLogic.ts
import { IBoundingBox, IDetectedParasite } from '../types';

export const processMicroscopicSample = (
  imageWidth: number,
  imageHeight: number,
  detectedParasites: IDetectedParasite[]
): IBoundingBox[] => {
  if (!detectedParasites || detectedParasites.length === 0) return [];

  // Acotamos las dimensiones de las cajas
  const boxWidth = 140;
  const boxHeight = 110;

  // Forzamos un punto central común de anclaje para simular proximidad/superposición real
  const centerX = imageWidth / 2;
  const centerY = imageHeight / 2;

  return detectedParasites.map((parasite, index) => {
    // El "index * 30" introduce un desfase controlado y pequeño para provocar la superposición
    // exacta entre Parásito 1 y Parásito 3 en el centro de la muestra microscópica
    const offsetX = index * 35 - 50;
    const offsetY = index * 20 - 40;

    const actualX = Math.max(0, Math.min(centerX + offsetX, imageWidth - boxWidth));
    const actualY = Math.max(0, Math.min(centerY + offsetY, imageHeight - boxHeight));

    return {
      box: [
        actualX / imageWidth,
        actualY / imageHeight,
        (actualX + boxWidth) / imageWidth,
        (actualY + boxHeight) / imageHeight,
      ],
      confidence: parasite.isGreyZone ? 0.62 : 0.94,
      classId: parasite.id ?? index + 1,
    };
  });
};

export const drawResults = (
  ctx: OffscreenCanvasRenderingContext2D | null,
  results: IBoundingBox[]
) => {
  if (!ctx) return;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.lineWidth = 3;
  ctx.font = '16px sans-serif';

  results.forEach((item) => {
    // Calculamos las coordenadas reales a partir de las normalizadas
    const x = item.box[0] * ctx.canvas.width;
    const y = item.box[1] * ctx.canvas.height;
    const width = (item.box[2] - item.box[0]) * ctx.canvas.width;
    const height = (item.box[3] - item.box[1]) * ctx.canvas.height;

    ctx.strokeStyle = '#00FF00';
    ctx.strokeRect(x, y, width, height);

    const text = `Class: ${item.classId}`;
    const textWidth = ctx.measureText(text).width;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x, y - 20, textWidth + 10, 20);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, x + 5, y - 5);
  });
};
