// src/worker.ts
import { WorkerMessage } from './types';
import { processMicroscopicSample, drawResults } from './workerLogic';

const ctxSelf = self as unknown as Worker;

let canvasContext: OffscreenCanvasRenderingContext2D | null = null;

ctxSelf.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data;

  if (msg.type === 'INIT_CANVAS') {
    const canvas = msg.canvas;
    canvasContext = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    console.log('Worker: OffscreenCanvas recibido e inicializado.');
    return;
  }

  if (msg.type === 'PROCESS_IMAGE') {
    const { imageWidth, imageHeight, detectedParasites } = msg;

    if (
      canvasContext &&
      (canvasContext.canvas.width !== imageWidth || canvasContext.canvas.height !== imageHeight)
    ) {
      canvasContext.canvas.width = imageWidth;
      canvasContext.canvas.height = imageHeight;
    }

    console.log('Worker: Procesando lógica...');

    setTimeout(() => {
      const results = processMicroscopicSample(imageWidth, imageHeight, detectedParasites);

      if (canvasContext) {
        drawResults(canvasContext, results);
        console.log('Worker: Renderizado completado en OffscreenCanvas.');
      }

      ctxSelf.postMessage({ results });
    }, 2000);
  }
};
