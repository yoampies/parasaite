import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ImageUploader from '../components/ImageUploader';
import ScannerCard from '../components/ScannerCard';
import RegularCard from '../components/RegularCard';
import { recentImages } from '../assets/constants';
import { useImageAnalysisWorker } from '../hooks/UseImageAnalysisWorker';

const Scanner: React.FC = () => {
  const [inputType, setInputType] = useState<'camera' | 'file'>('camera');
  const [cameraStream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<number | undefined>(undefined);

  const { processSource, detectedParasites, isLoading } = useImageAnalysisWorker();

  const hasHighUncertainty = useMemo(() => {
    return detectedParasites.some((pred) => pred.isGreyZone === true);
  }, [detectedParasites]);

  // Bucle de inferencia preciso para video
  const runInferenceLoop = useCallback(() => {
    if (!isRecording || !videoRef.current) {
      console.log('Scanner: Bucle parado.');
      return;
    }

    processSource(videoRef.current);

    // Encadenamos de forma segura limpiando referencias previas
    timeoutRef.current = window.setTimeout(() => {
      requestRef.current = requestAnimationFrame(runInferenceLoop);
    }, 150);
  }, [isRecording, processSource]);

  // Manejo de la grabación y limpieza rigurosa de timers
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

  // Efecto para dibujar predicciones (Compatible con Cámara e Imagen Estática)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Determinar dimensiones de origen según el tipo de entrada
    let sourceWidth = 0;
    let sourceHeight = 0;

    if (inputType === 'camera' && videoRef.current) {
      sourceWidth = videoRef.current.videoWidth;
      sourceHeight = videoRef.current.videoHeight;
    } else if (inputType === 'file' && selectedImage) {
      sourceWidth = canvas.parentElement?.clientWidth || 1280;
      sourceHeight = canvas.parentElement?.clientHeight || 720;
    }

    if (sourceWidth && sourceHeight) {
      if (canvas.width !== sourceWidth || canvas.height !== sourceHeight) {
        canvas.width = sourceWidth;
        canvas.height = sourceHeight;
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // En modo cámara, si no está grabando no dibujamos nada
    if (inputType === 'camera' && !isRecording) return;

    detectedParasites.forEach((pred) => {
      const x = pred.box[0] * canvas.width;
      const y = pred.box[1] * canvas.height;
      const w = (pred.box[2] - pred.box[0]) * canvas.width;
      const h = (pred.box[3] - pred.box[1]) * canvas.height;

      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      ctx.font = 'bold 16px Arial';
      const label = `Parásito ${pred.classId}`;
      const textWidth = ctx.measureText(label).width;

      ctx.fillStyle = '#10B981';
      ctx.fillRect(x, y > 20 ? y - 25 : y, textWidth + 10, 25);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, x + 5, y > 20 ? y - 7 : y + 18);
    });
  }, [detectedParasites, isRecording, inputType, selectedImage]);

  // Control del ciclo de vida de la cámara
  useEffect(() => {
    stopCamera();
    if (inputType === 'camera') {
      startCamera();
      setSelectedImage(null);
    }
    return () => stopCamera();
  }, [inputType]);

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

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col gap-8">
      <div className="flex bg-neutral-100 p-1 rounded-xl max-w-md mx-auto shadow-inner w-full">
        <button
          onClick={() => setInputType('camera')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            inputType === 'camera' ? 'bg-white text-emerald-600 shadow-sm' : 'text-neutral-500'
          }`}
        >
          🎥 Cámara en Vivo
        </button>
        <button
          onClick={() => setInputType('file')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            inputType === 'file' ? 'bg-white text-emerald-600 shadow-sm' : 'text-neutral-500'
          }`}
        >
          📁 Subir Archivo
        </button>
      </div>

      <div
        className={`w-full relative bg-neutral-900 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center aspect-video max-h-[70vh] ${isLoading ? 'ring-2 ring-emerald-500' : ''}`}
      >
        {hasHighUncertainty && (
          <div className="absolute top-4 left-4 right-4 bg-amber-500/95 border border-amber-400 text-neutral-900 px-4 py-3 rounded-xl shadow-xl z-30 flex items-center gap-3 animate-pulse">
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
                className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
              >
                {isRecording ? '⏹ Detener Escaneo' : '⏺ Iniciar Escaneo'}
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full p-4 bg-white flex items-center justify-center overflow-auto relative">
            {!selectedImage ? (
              <ImageUploader
                instruction="Análisis estático de muestras"
                onFileSelect={async (file) => {
                  const objectUrl = URL.createObjectURL(file);
                  setSelectedImage(objectUrl);
                  const img = new Image();
                  img.src = objectUrl;
                  img.onload = () => {
                    processSource(img);
                  };
                }}
              />
            ) : (
              <img
                src={selectedImage}
                alt="Muestra subida"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        )}

        <canvas
          id="scanner-overlay"
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        />
      </div>

      {inputType === 'file' && selectedImage && (
        <div className="w-full max-w-md mx-auto flex flex-col gap-2 items-center">
          <ScannerCard imgURL={selectedImage} isSelected={true} />
          <button
            onClick={() => {
              setSelectedImage(null);
            }}
            className="text-sm text-red-500 hover:underline"
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
