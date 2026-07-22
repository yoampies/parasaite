import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ImageUploader from '../components/ImageUploader';
import ScannerCard from '../components/ScannerCard';
import RegularCard from '../components/RegularCard';
import { recentImages, parasiteTypes } from '../assets/constants';
import { useImageAnalysisWorker } from '../hooks/UseImageAnalysisWorker';

const Scanner: React.FC = () => {
  const [inputType, setInputType] = useState<'camera' | 'file'>('camera');
  const [cameraStream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [memoryError, setMemoryError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<number | undefined>(undefined);

  const { processSource, detectedParasites, isLoading, isModelLoading, clearDetections } =
    useImageAnalysisWorker();

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      if (
        event.message &&
        (event.message.includes('out of memory') ||
          event.message.includes('OOM') ||
          event.message.includes('memory'))
      ) {
        setMemoryError(true);
      }
    };
    window.addEventListener('error', handleGlobalError);
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  const hasHighUncertainty = useMemo(() => {
    return detectedParasites.some((pred) => pred.isGreyZone === true);
  }, [detectedParasites]);

  const runInferenceLoop = useCallback(() => {
    if (!isRecording || !videoRef.current) {
      console.log('Scanner: Bucle parado.');
      return;
    }

    processSource(videoRef.current);

    timeoutRef.current = window.setTimeout(() => {
      requestRef.current = requestAnimationFrame(runInferenceLoop);
    }, 150);
  }, [isRecording, processSource]);

  useEffect(() => {
    if (isRecording) {
      runInferenceLoop();
    } else {
      if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
      if (requestRef.current !== undefined) cancelAnimationFrame(requestRef.current);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    return () => {
      if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
      if (requestRef.current !== undefined) cancelAnimationFrame(requestRef.current);
    };
  }, [isRecording, runInferenceLoop]);

  // Dibujar predicciones alineadas milimétricamente al contenedor visible
  const drawDetections = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    if (inputType === 'file' && !selectedImage) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let displayWidth = 0;
    let displayHeight = 0;

    if (inputType === 'camera' && videoRef.current) {
      displayWidth = videoRef.current.clientWidth || videoRef.current.videoWidth;
      displayHeight = videoRef.current.clientHeight || videoRef.current.videoHeight;
    } else if (inputType === 'file' && imageRef.current) {
      displayWidth = imageRef.current.clientWidth;
      displayHeight = imageRef.current.clientHeight;
    }

    if (displayWidth && displayHeight) {
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (inputType === 'camera' && !isRecording) return;

    if (Array.isArray(detectedParasites)) {
      detectedParasites.forEach((pred) => {
        if (!pred?.box || pred.box.length < 4) return;

        const x = pred.box[0] * canvas.width;
        const y = pred.box[1] * canvas.height;
        const w = (pred.box[2] - pred.box[0]) * canvas.width;
        const h = (pred.box[3] - pred.box[1]) * canvas.height;

        const isUncertain = pred.isGreyZone || hasHighUncertainty;
        const strokeColor = isUncertain ? '#F59E0B' : '#10B981';

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);

        ctx.font = 'bold 13px Arial';

        const parasiteName = parasiteTypes[pred.classId] || `${pred.classId}`;
        const label = isUncertain ? 'Posible forma parasitaria' : parasiteName;
        const textWidth = ctx.measureText(label).width;

        ctx.fillStyle = strokeColor;
        ctx.fillRect(x, y > 20 ? y - 22 : y, textWidth + 10, 22);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(label, x + 5, y > 20 ? y - 6 : y + 15);
      });
    }
  }, [detectedParasites, isRecording, inputType, selectedImage, hasHighUncertainty]);

  useEffect(() => {
    drawDetections();
    window.addEventListener('resize', drawDetections);
    return () => window.removeEventListener('resize', drawDetections);
  }, [drawDetections]);

  useEffect(() => {
    stopCamera();
    clearDetections();
    if (inputType === 'camera') {
      startCamera();
      setSelectedImage(null);
    }
    return () => stopCamera();
  }, [inputType, clearDetections]);

  async function startCamera() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Scanner: Error al acceder a la cámara:', err);
      setCameraError('No se pudo acceder a la cámara.');
      setInputType('file');
    }
  }

  function stopCamera() {
    setIsRecording(false);
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  const handleFileSelect = async (file: File) => {
    clearDetections();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedImage(objectUrl);
    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      processSource(img);
    };
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col gap-8 relative">
      {memoryError && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 text-center">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-lg font-bold text-neutral-900">Memoria Insuficiente</h3>
            <p className="text-sm text-neutral-600">
              Tu dispositivo se ha quedado sin memoria. Por favor, cierra otras pestañas o usa una
              imagen más pequeña.
            </p>
            <button
              onClick={() => setMemoryError(false)}
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {isModelLoading && (
        <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-4 text-center rounded-2xl">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-sm md:text-base font-medium">
            Cargando modelo de IA optimizado para móvil...
          </p>
        </div>
      )}

      <div className="flex bg-neutral-100 p-1 rounded-xl max-w-md mx-auto shadow-inner w-full">
        <button
          onClick={() => {
            clearDetections();
            setInputType('camera');
          }}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            inputType === 'camera' ? 'bg-white text-emerald-600 shadow-sm' : 'text-neutral-500'
          }`}
        >
          🎥 Cámara en Vivo
        </button>
        <button
          onClick={() => {
            clearDetections();
            setInputType('file');
          }}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            inputType === 'file' ? 'bg-white text-emerald-600 shadow-sm' : 'text-neutral-500'
          }`}
        >
          📁 Subir Archivo
        </button>
      </div>

      <div
        className={`w-full relative bg-neutral-900 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center ${
          inputType === 'camera' ? 'aspect-video max-h-[70vh]' : 'min-h-[300px] max-h-[70vh] p-4'
        } ${isLoading ? 'ring-2 ring-emerald-500' : ''}`}
      >
        {hasHighUncertainty && (
          <div className="absolute top-4 left-4 right-4 bg-amber-500/95 border border-amber-400 text-neutral-900 px-4 py-3 rounded-xl shadow-xl z-30 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div className="text-left font-inter">
              <span className="font-bold block text-xs md:text-sm uppercase tracking-wider">
                Incertidumbre Alta Detectada
              </span>
              <p className="text-xs md:text-sm font-normal text-neutral-800">
                Por favor, aumente el objetivo físico de su microscopio para verificar morfología
                interna.
              </p>
            </div>
          </div>
        )}

        {inputType === 'camera' ? (
          <>
            {cameraError && (
              <div className="absolute inset-0 bg-neutral-900/90 flex items-center justify-center p-4 text-center z-10">
                <p className="text-red-400 text-sm font-medium">{cameraError}</p>
              </div>
            )}
            <video
              id="microscope-preview"
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 z-20">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {isRecording ? '⏹ Detener Escaneo' : '⏺ Iniciar Escaneo'}
              </button>
            </div>
            <canvas
              id="scanner-overlay"
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {!selectedImage ? (
              <ImageUploader
                instruction="Análisis estático de muestras"
                onFileSelect={handleFileSelect}
              />
            ) : (
              <div className="relative inline-flex items-center justify-center max-w-full max-h-[65vh]">
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Muestra subida"
                  onLoad={drawDetections}
                  className="max-w-full max-h-[65vh] object-contain block rounded-lg"
                />
                <canvas
                  id="scanner-overlay"
                  ref={canvasRef}
                  className="absolute top-0 left-0 pointer-events-none z-10"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {inputType === 'file' && selectedImage && (
        <div className="w-full max-w-md mx-auto flex flex-col gap-3 items-center">
          <ScannerCard imgURL={selectedImage} isSelected={false} />
          <button
            onClick={() => {
              clearDetections();
              setSelectedImage(null);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-teal-600 bg-white border border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-all shadow-sm active:scale-95"
          >
            Cambiar imagen
          </button>
        </div>
      )}

      <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 flex flex-col gap-6 w-full mt-4">
        <div>
          <h3 className="text-[#101816] text-xl font-bold leading-tight">Capturas Recientes</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recentImages.map((analysis) => (
            <RegularCard
              key={analysis.id}
              title={analysis.fileName || `Muestra #${analysis.id}`}
              content={analysis.content}
              imgURL={analysis.imgURL}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
