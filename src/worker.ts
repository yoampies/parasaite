// src/worker.ts
import { WorkerPayload } from './types';
import { processMicroscopicSample } from './workerLogic';

const ctx = self as unknown as Worker;

ctx.onmessage = async (e: MessageEvent<WorkerPayload>) => {
  console.log('Worker: Procesando muestra microscópica...');

  const { imageWidth, imageHeight, detectedParasites } = e.data;

  setTimeout(() => {
    const results = processMicroscopicSample(imageWidth, imageHeight, detectedParasites);

    console.log('Worker: Segmentación completada. Enviando coordenadas al UI Thread.');
    ctx.postMessage({ results });
  }, 3000);
};
