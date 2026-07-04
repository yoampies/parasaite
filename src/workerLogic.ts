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
      box: [randomX, randomY, randomWidth, randomHeight],
      confidence: 0.9,
      classId: parasite.id,
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
    // Desestructuramos el arreglo [x, y, w, h]
    const [x, y, width, height] = item.box;

    ctx.strokeStyle = '#00FF00';
    ctx.strokeRect(x, y, width, height);

    // Si tu interfaz no tiene label, necesitas mapear classId a un nombre
    // O añadir 'label' a tu interfaz IBoundingBox
    const text = `Class: ${item.classId}`;
    const textWidth = ctx.measureText(text).width;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x, y - 20, textWidth + 10, 20);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, x + 5, y - 5);
  });
};
