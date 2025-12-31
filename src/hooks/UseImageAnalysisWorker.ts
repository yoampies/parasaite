import { useState, useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { IAnalysis, WorkerPayload, IBoundingBox } from '../types';

import AnalysisWorker from '../worker?worker';

interface WorkerResponse {
  results: IBoundingBox[];
}

const useImageAnalysisWorker = (
  imageLoaded: boolean,
  analysis: IAnalysis | null,
  drawCanvas: (results: IBoundingBox[]) => void,
  imgRef: RefObject<HTMLImageElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  progressBarRef: RefObject<HTMLDivElement | null>,
  scannerContainerRef: RefObject<HTMLDivElement | null>
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detectedParasites, setDetectedParasites] = useState<IBoundingBox[]>([]);

  useEffect(() => {
    const img = imgRef.current;
    const progressBar = progressBarRef.current;
    const canvas = canvasRef.current;
    const scannerContainer = scannerContainerRef.current;

    if (!imageLoaded || !analysis || !img || !canvas || !progressBar || !scannerContainer) {
      return;
    }

    setIsLoading(true);
    const worker = new AnalysisWorker();

    const imgData: WorkerPayload = {
      imageWidth: img.naturalWidth,
      imageHeight: img.naturalHeight,
      detectedParasites: analysis.detectedParasites,
    };

    worker.postMessage(imgData);

    const progressTween = gsap.fromTo(
      progressBar,
      { width: '0%' },
      {
        width: '100%',
        duration: 3,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsLoading(false);
        },
      }
    );

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const results = e.data.results;
      setDetectedParasites(results);
      drawCanvas(results);

      // Feedback visual
      const zoomTweens = gsap.timeline();
      zoomTweens
        .to(scannerContainer, { scale: 1.02, duration: 0.2 })
        .to(scannerContainer, { scale: 1, duration: 0.2 });
    };

    return () => {
      worker.terminate();
      progressTween.kill();
    };
  }, [analysis, drawCanvas, imageLoaded, imgRef, canvasRef, progressBarRef, scannerContainerRef]);

  return { detectedParasites, isLoading };
};

export default useImageAnalysisWorker;
