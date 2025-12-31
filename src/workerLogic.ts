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
