import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // Usamos el hook refactorizado, incluyendo isLoading
  const { processSource, detectedParasites, isLoading } = useImageAnalysisWorker();

  // Bucle de inferencia para video
  const runInferenceLoop = useCallback(() => {
    if (!isRecording || !videoRef.current) return;

    processSource(videoRef.current);

    setTimeout(() => {
      requestRef.current = requestAnimationFrame(runInferenceLoop);
    }, 150);
  }, [isRecording, processSource]);

  // Manejo de la grabación y limpieza del canvas
  useEffect(() => {
    if (isRecording) {
      runInferenceLoop();
    } else {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRecording, runInferenceLoop]);

  // Efecto para dibujar predicciones
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const video = videoRef.current;

    if (!ctx || !canvas || !video) return;

    // 1. Sincronizar resolución interna con el tamaño mostrado
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Limpiar si no está grabando
    if (!isRecording) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detectedParasites.forEach((pred) => {
      // Escalar coordenadas relativas al tamaño real del canvas
      const x = pred.box[0] * canvas.width;
      const y = pred.box[1] * canvas.height;
      const w = (pred.box[2] - pred.box[0]) * canvas.width;
      const h = (pred.box[3] - pred.box[1]) * canvas.height;

      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      // 2. Optimización de la etiqueta
      ctx.font = 'bold 16px Arial';
      const label = `Parásito ${pred.classId}`;
      const textWidth = ctx.measureText(label).width;

      // Fondo para la etiqueta
      ctx.fillStyle = '#10B981';
      ctx.fillRect(x, y > 20 ? y - 25 : y, textWidth + 10, 25);

      // Texto
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, x + 5, y > 20 ? y - 7 : y + 18);
    });
  }, [detectedParasites, isRecording]);

  // Manejo de la cámara y limpieza de recursos
  useEffect(() => {
    stopCamera();

    if (inputType === 'camera') {
      startCamera();
      setSelectedImage(null);
    }

    return () => {
      stopCamera();
    };
  }, [inputType]);

  async function startCamera() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Scanner: Error al acceder a la cámara:', err);
      setCameraError('No se pudo acceder a la cámara.');
      setInputType('file');
    }
  }

  function stopCamera() {
    setIsRecording(false);
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
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
            <canvas
              id="scanner-overlay"
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
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
          <div className="w-full h-full p-4 bg-white flex items-center justify-center overflow-auto">
            <ImageUploader
              instruction="Análisis estático de muestras"
              onFileSelect={(file) => {
                const objectUrl = URL.createObjectURL(file);
                setSelectedImage(objectUrl);
              }}
            />
          </div>
        )}
      </div>

      {inputType === 'file' && selectedImage && (
        <div className="w-full max-w-md mx-auto">
          <ScannerCard imgURL={selectedImage} isSelected={true} />
        </div>
      )}

      <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 flex flex-col gap-6 w-full mt-4">
        <div>
          <h3 className="text-[#101816] text-xl font-bold leading-tight">Capturas Recientes</h3>
          <p className="text-[#5e8d81] text-sm font-normal mt-1">
            Muestras en las últimas 24 horas
          </p>
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
