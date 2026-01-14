import { useState, useEffect, RefObject, useRef } from 'react';
import { gsap } from 'gsap';
import { IAnalysis, IBoundingBox, WorkerMessage } from '../types';
import AnalysisWorker from '../worker?worker';

const useImageAnalysisWorker = (
  imageLoaded: boolean,
  analysis: IAnalysis | null,
  imgRef: RefObject<HTMLImageElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  progressBarRef: RefObject<HTMLDivElement | null>,
  scannerContainerRef: RefObject<HTMLDivElement | null>
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detectedParasites, setDetectedParasites] = useState<IBoundingBox[]>([]);

  const workerRef = useRef<Worker | null>(null);
  const isCanvasTransferred = useRef<boolean>(false);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new AnalysisWorker();

      workerRef.current.onmessage = (e) => {
        const results = e.data.results;
        setDetectedParasites(results);
        setIsLoading(false);

        if (scannerContainerRef.current) {
          gsap.to(scannerContainerRef.current, {
            scale: 1,
            duration: 0.2,
            ease: 'back.out(1.7)',
          });
        }
      };
    }

    const worker = workerRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const progressBar = progressBarRef.current;

    if (!imageLoaded || !analysis || !img || !canvas || !progressBar) return;

    if (!isCanvasTransferred.current) {
      const offscreen = canvas.transferControlToOffscreen();

      worker.postMessage({ type: 'INIT_CANVAS', canvas: offscreen }, [offscreen]);

      isCanvasTransferred.current = true;
    }

    setIsLoading(true);

    if (scannerContainerRef.current) {
      gsap.to(scannerContainerRef.current, { scale: 1.02, duration: 0.5 });
    }
    const progressTween = gsap.fromTo(
      progressBar,
      { width: '0%' },
      { width: '100%', duration: 2, ease: 'power2.inOut' }
    );

    const processMsg: WorkerMessage = {
      type: 'PROCESS_IMAGE',
      imageWidth: img.naturalWidth,
      imageHeight: img.naturalHeight,
      detectedParasites: analysis.detectedParasites,
    };
    worker.postMessage(processMsg);

    return () => {
      progressTween.kill();
      if (workerRef.current) {
        workerRef.current.terminate(); // ¡Bang!
        workerRef.current = null;
      }
      isCanvasTransferred.current = false;
    };
  }, [imageLoaded, analysis, imgRef, canvasRef, progressBarRef, scannerContainerRef]);

  return { detectedParasites, isLoading };
};

export default useImageAnalysisWorker;
