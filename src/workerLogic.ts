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
      x: randomX,
      y: randomY,
      width: randomWidth,
      height: randomHeight,
      detectedParasites: [parasite],
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

  results.forEach((box) => {
    ctx.strokeStyle = '#00FF00';
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    const text = box.detectedParasites[0].label;
    const textWidth = ctx.measureText(text).width;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(box.x, box.y - 20, textWidth + 10, 20);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, box.x + 5, box.y - 5);
  });
};
