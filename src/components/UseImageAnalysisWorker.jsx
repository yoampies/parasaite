import { useState, useEffect } from 'react'; // useRef is not needed here
import { gsap } from 'gsap';

const useImageAnalysisWorker = (imageLoaded, analysis, drawCanvas, imgRef, canvasRef, progressBarRef, scannerContainerRef) => {
    const [isLoading, setIsLoading] = useState(true);
    const [detectedParasites, setDetectedParasites] = useState([]);

    useEffect(() => {
        setIsLoading(true);

        const img = imgRef.current;
        const progressBar = progressBarRef.current;
        const canvas = canvasRef.current;
        const scannerContainer = scannerContainerRef.current;

        if (
            !imageLoaded ||
            !analysis || 
            !img || 
            !canvas || 
            !progressBar || 
            !scannerContainer
        ) return;

        console.log(analysis.detectedParasites)
        const worker = new Worker(new URL("../worker.js", import.meta.url));
        const imgData = {
            imageWidth: img.naturalWidth,
            imageHeight: img.naturalHeight,
            detectedParasites: analysis.detectedParasites,
        };

        worker.postMessage(imgData);

        const progressTween = gsap.fromTo(progressBar, {width: "0%"}, {
            width:"100%", 
            duration: 3, 
            onComplete: () => {
                setIsLoading(false)
            }
        });

        worker.onmessage = (e) => {
            const results = e.data.results;
            setDetectedParasites(results);
            drawCanvas(results);
            ; 

            const zoomTweens = gsap.timeline();
            zoomTweens.to(scannerContainer, {scale: 1.02, duration: 0.2});
            zoomTweens.to(scannerContainer, {scale: 1, duration: 0.2});
        }

        return() => {
            worker.terminate();
            progressTween.kill();
        }
    }, [analysis, drawCanvas, imageLoaded]);

    return { detectedParasites, isLoading }
}

export default useImageAnalysisWorker;