// src/workerLogic.ts
import { IBoundingBox, IDetectedParasite } from './types';

export const processMicroscopicSample = (
  imageWidth: number,
  imageHeight: number,
  detectedParasites: IDetectedParasite[]
): IBoundingBox[] => {
  if (!detectedParasites || detectedParasites.length === 0) return [];

  const minBoxWidth = 100;
  const maxBoxWidth = 200;
  const minBoxHeight = 75;
  const maxBoxHeight = 150;

  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return detectedParasites.map((parasite) => {
    const randomWidth = getRandomNumber(minBoxWidth, maxBoxWidth);
    const randomHeight = getRandomNumber(minBoxHeight, maxBoxHeight);

    const randomX = getRandomNumber(0, imageWidth - randomWidth);
    const randomY = getRandomNumber(0, imageHeight - randomHeight);

    return {
      // Normalización estricta [0.0 - 1.0]
      box: [
        randomX / imageWidth,
        randomY / imageHeight,
        (randomX + randomWidth) / imageWidth, // xMax normalizado
        (randomY + randomHeight) / imageHeight, // yMax normalizado
      ],
      confidence: 0.9,
      classId: parasite.id ?? 0,
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
