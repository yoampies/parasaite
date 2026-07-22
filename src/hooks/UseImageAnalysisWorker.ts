import { useState, useEffect, useRef, useCallback } from 'react';
import { IBoundingBox } from '../types';

export const useImageAnalysisWorker = () => {
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectedParasites, setDetectedParasites] = useState<IBoundingBox[]>([]);

  const workerRef = useRef<Worker | null>(null);
  const isWorkerBusy = useRef<boolean>(false);
  const isMounted = useRef<boolean>(true);

  const lastValidDetectionsRef = useRef<IBoundingBox[]>([]);
  const lastDetectionTimeRef = useRef<number>(Date.now());

  const clearDetections = useCallback(() => {
    lastValidDetectionsRef.current = [];
    lastDetectionTimeRef.current = 0;
    setDetectedParasites([]);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    setIsModelLoading(true);

    const newWorker = new Worker(new URL('../workers/yoloWorker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = newWorker;

    newWorker.postMessage({
      type: 'INIT',
      payload: { modelPath: '/ml_model/model.onnx' },
    });

    newWorker.onmessage = (e) => {
      if (!isMounted.current) return;

      const { type, payload } = e.data;

      if (type === 'READY') {
        setIsModelLoading(false);
      } else if (type === 'RESULT') {
        const PROTOZOARIOS_Y_BLASTOCYSTIS = [1, 2, 5];
        const rawResults = payload || [];

        const processedResults = rawResults.map((item: IBoundingBox) => {
          const inGreyZone =
            PROTOZOARIOS_Y_BLASTOCYSTIS.includes(item.classId) &&
            item.confidence >= 0.35 &&
            item.confidence <= 0.55;
          return { ...item, isGreyZone: inGreyZone };
        });

        if (processedResults.length > 0) {
          lastValidDetectionsRef.current = processedResults;
          lastDetectionTimeRef.current = Date.now();
          setDetectedParasites(processedResults);
        } else {
          const timeElapsed = Date.now() - lastDetectionTimeRef.current;
          if (timeElapsed > 1500) {
            setDetectedParasites([]);
          } else {
            setDetectedParasites(lastValidDetectionsRef.current);
          }
        }

        setIsDetecting(false);
        isWorkerBusy.current = false;
      } else if (type === 'ERROR') {
        console.error('Worker: Error crítico detectado:', payload);
        setIsDetecting(false);
        isWorkerBusy.current = false;
      }
    };

    newWorker.onerror = (err) => {
      console.error('Worker: Error de ejecución en el hilo secundario:', err);
      if (isMounted.current) {
        setIsModelLoading(false);
        setIsDetecting(false);
        isWorkerBusy.current = false;
      }
    };

    return () => {
      isMounted.current = false;
      newWorker.terminate();
      workerRef.current = null;
    };
  }, []);

  const processSource = useCallback(
    async (source: HTMLVideoElement | HTMLImageElement) => {
      if (!workerRef.current || isWorkerBusy.current || isModelLoading) {
        return;
      }

      try {
        isWorkerBusy.current = true;
        setIsDetecting(true);

        const targetSize = 640;
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('No se pudo obtener el contexto 2D del canvas de preprocesamiento.');
        }

        ctx.drawImage(source, 0, 0, targetSize, targetSize);
        const imageData = ctx.getImageData(0, 0, targetSize, targetSize);

        const pixels = imageData.data;
        const floatArray = new Float32Array(targetSize * targetSize * 3);

        let idx = 0;
        const totalPixels = targetSize * targetSize;
        for (let i = 0; i < totalPixels; i++) {
          floatArray[i] = pixels[idx] / 255.0;
          floatArray[i + totalPixels] = pixels[idx + 1] / 255.0;
          floatArray[i + totalPixels * 2] = pixels[idx + 2] / 255.0;
          idx += 4;
        }

        if (isMounted.current && workerRef.current) {
          workerRef.current.postMessage(
            {
              type: 'PREDICT',
              payload: {
                floatArray: floatArray,
                dims: [1, 3, targetSize, targetSize],
              },
            },
            [floatArray.buffer]
          );
        } else {
          isWorkerBusy.current = false;
          setIsDetecting(false);
        }
      } catch (err) {
        console.error('Error al procesar fuente en el hook:', err);
        if (isMounted.current) {
          isWorkerBusy.current = false;
          setIsDetecting(false);
        }
      }
    },
    [isModelLoading]
  );

  return {
    detectedParasites,
    isLoading: isModelLoading || isDetecting,
    isModelLoading,
    isDetecting,
    processSource,
    clearDetections,
  };
};

export default useImageAnalysisWorker;
