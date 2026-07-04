import { useState, useEffect, useRef, useCallback } from 'react';
import { IBoundingBox } from '../types';
import AnalysisWorker from '../worker?worker';

export const useImageAnalysisWorker = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detectedParasites, setDetectedParasites] = useState<IBoundingBox[]>([]);

  const workerRef = useRef<Worker | null>(null);
  const isWorkerBusy = useRef<boolean>(false);
  const isMounted = useRef(true);

  // Referencias para persistencia anti-shake
  const lastValidDetectionsRef = useRef<IBoundingBox[]>([]);
  const lastDetectionTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    isMounted.current = true;
    workerRef.current = new AnalysisWorker();

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'INFERENCE_SUCCESS') {
        if (isMounted.current) {
          const PROTOZOARIOS_Y_BLASTOCYSTIS = [1, 2, 5]; // IDs asignados en tu modelo
          const rawResults = e.data.results || [];

          const processedResults = rawResults.map((item: IBoundingBox) => {
            const inGreyZone =
              PROTOZOARIOS_Y_BLASTOCYSTIS.includes(item.classId) &&
              item.confidence >= 0.35 &&
              item.confidence <= 0.55;
            return { ...item, isGreyZone: inGreyZone };
          });

          // Lógica de persistencia anti-shake
          if (processedResults.length > 0) {
            lastValidDetectionsRef.current = processedResults;
            lastDetectionTimeRef.current = Date.now();
            setDetectedParasites(processedResults);
          } else {
            // Si viene vacío, validamos si estamos dentro de la ventana de gracia de 1.5s
            const timeElapsed = Date.now() - lastDetectionTimeRef.current;
            if (timeElapsed > 1500) {
              setDetectedParasites([]);
            } else {
              // Mantenemos persistente las detecciones anteriores durante la transición física
              setDetectedParasites(lastValidDetectionsRef.current);
            }
          }

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
    if (!workerRef.current || isWorkerBusy.current) {
      if (!workerRef.current) {
        console.error('Hook: workerRef.current es nulo. El worker no se ha inicializado.');
      }
      return;
    }

    try {
      isWorkerBusy.current = true;
      setIsLoading(true);

      const bitmap = await createImageBitmap(source);
      console.log(
        `Hook: Bitmap creado correctamente. Dimensiones: ${bitmap.width}x${bitmap.height}`
      );

      // Verificación de seguridad antes de enviar
      if (isMounted.current && workerRef.current) {
        console.log('Hook: Enviando imagen al worker...');
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
