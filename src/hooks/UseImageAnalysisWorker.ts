import { useState, useEffect, useRef, useCallback } from 'react';
import { IBoundingBox } from '../types';
import AnalysisWorker from '../worker?worker';

export const useImageAnalysisWorker = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detectedParasites, setDetectedParasites] = useState<IBoundingBox[]>([]);

  const workerRef = useRef<Worker | null>(null);
  const isWorkerBusy = useRef<boolean>(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    workerRef.current = new AnalysisWorker();

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'INFERENCE_SUCCESS') {
        if (isMounted.current) {
          setDetectedParasites(e.data.results);
          setIsLoading(false);
        }
      }
      isWorkerBusy.current = false;
    };

    workerRef.current.onerror = (err) => {
      console.error('Worker: Error crítico detectado:', err);
      isWorkerBusy.current = false;
      if (isMounted.current) {
        setIsLoading(false);
      }
    };

    return () => {
      isMounted.current = false;
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  // 2. PIPELINE UNIFICADO (Imagen o Video)
  const processSource = useCallback(async (source: HTMLVideoElement | HTMLImageElement) => {
    if (!workerRef.current || isWorkerBusy.current) return;

    try {
      isWorkerBusy.current = true;
      setIsLoading(true);

      const bitmap = await createImageBitmap(source);

      // Verificación de seguridad antes de enviar
      if (isMounted.current && workerRef.current) {
        workerRef.current.postMessage({ type: 'PROCESS_IMAGE', imageBitmap: bitmap }, [bitmap]);
      } else {
        bitmap.close();
        isWorkerBusy.current = false;
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error al procesar fuente:', err);
      if (isMounted.current) {
        isWorkerBusy.current = false;
        setIsLoading(false);
      }
    }
  }, []);

  return {
    detectedParasites,
    isLoading,
    processSource,
  };
};

export default useImageAnalysisWorker;
