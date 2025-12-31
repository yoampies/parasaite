import { useState, useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { IAnalysis, WorkerPayload } from '../types';

/**
 * Interfaz para la respuesta que recibimos del Worker
 */
interface WorkerResponse {
  results: any[]; // Cambia 'any' por la interfaz de tus Bounding Boxes si la tienes
}

const useImageAnalysisWorker = (
  imageLoaded: boolean,
  analysis: IAnalysis | null,
  drawCanvas: (results: any[]) => void,
  imgRef: RefObject<HTMLImageElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  progressBarRef: RefObject<HTMLDivElement | null>,
  scannerContainerRef: RefObject<HTMLDivElement | null>
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detectedParasites, setDetectedParasites] = useState<any[]>([]);

  useEffect(() => {
    // 1. Guardias de seguridad para evitar errores de nulidad
    const img = imgRef.current;
    const progressBar = progressBarRef.current;
    const canvas = canvasRef.current;
    const scannerContainer = scannerContainerRef.current;

    if (!imageLoaded || !analysis || !img || !canvas || !progressBar || !scannerContainer) {
      return;
    }

    setIsLoading(true);

    // 2. Inicialización del Web Worker
    // Nota: Usamos la sintaxis de URL de Vite/Webpack para compatibilidad con TS
    const worker = new Worker(new URL("../worker.ts", import.meta.url));

    const imgData: WorkerPayload = {
      imageWidth: img.naturalWidth,
      imageHeight: img.naturalHeight,
      detectedParasites: analysis.detectedParasites,
    };

    worker.postMessage(imgData);

    // 3. Animación de carga con GSAP
    const progressTween = gsap.fromTo(progressBar, 
      { width: "0%" }, 
      {
        width: "100%", 
        duration: 3, 
        ease: "power2.inOut",
        onComplete: () => {
          setIsLoading(false);
        }
      }
    );

    // 4. Manejo de respuesta del Worker
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const results = e.data.results;
      setDetectedParasites(results);
      drawCanvas(results);

      // Animación de feedback visual al terminar
      const zoomTweens = gsap.timeline();
      zoomTweens
        .to(scannerContainer, { scale: 1.02, duration: 0.2 })
        .to(scannerContainer, { scale: 1, duration: 0.2 });
    };

    // 5. Cleanup: Fundamental para evitar memory leaks y procesos zombies
    return () => {
      worker.terminate();
      progressTween.kill();
    };
  }, [analysis, drawCanvas, imageLoaded, imgRef, canvasRef, progressBarRef, scannerContainerRef]);

  return { detectedParasites, isLoading };
};

export default useImageAnalysisWorker;