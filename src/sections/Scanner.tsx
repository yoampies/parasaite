import React, { useState, useEffect, useRef } from 'react';
import ImageUploader from '../components/ImageUploader';
import ScannerCard from '../components/ScannerCard';
import RegularCard from '../components/RegularCard';
import { recentImages } from '../assets/constants';

const Scanner: React.FC = () => {
  const [inputType, setInputType] = useState<'camera' | 'file'>('camera');
  const [cameraStream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (inputType === 'camera') {
      startCamera();
      setSelectedImage(null);
    } else {
      stopCamera();
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
      setCameraError('No se pudo acceder a la cámara. Verifica los permisos de tu dispositivo.');
      setInputType('file');
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  return (
    // Reduje un poco el max-w-7xl a max-w-5xl para que el video no sea gigantesco y se vea muy profesional
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col gap-8">
      {/* 1. Selector de Entrada de la UI (Centrado arriba) */}
      <div className="flex bg-neutral-100 p-1 rounded-xl max-w-md mx-auto shadow-inner w-full">
        <button
          onClick={() => setInputType('camera')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            inputType === 'camera'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>🎥</span> Cámara en Vivo
        </button>
        <button
          onClick={() => setInputType('file')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            inputType === 'file'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>📁</span> Subir Archivo
        </button>
      </div>

      {/* 2. El visor del microscopio o el área de subida (Ocupa todo el ancho del contenedor) */}
      <div className="w-full relative bg-neutral-900 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center aspect-video max-h-[70vh]">
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
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
            />
          </>
        ) : (
          <div className="w-full h-full p-4 bg-white flex items-center justify-center overflow-auto">
            <ImageUploader
              instruction="Análisis estático de muestras"
              onFileSelect={(file) => {
                const objectUrl = URL.createObjectURL(file);
                setSelectedImage(objectUrl);
                console.log('Archivo microscópico cargado:', file);
              }}
            />
          </div>
        )}
      </div>

      {/* Tarjeta de previsualización estática (Centrada bajo el uploader si hay un archivo) */}
      {inputType === 'file' && selectedImage && (
        <div className="w-full max-w-md mx-auto">
          <ScannerCard imgURL={selectedImage} isSelected={true} />
        </div>
      )}

      {/* 3. Bloque contenedor de Capturas Recientes (Abajo en filas anchas) */}
      <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 flex flex-col gap-6 w-full mt-4">
        <div>
          <h3 className="text-[#101816] text-xl font-bold leading-tight">Capturas Recientes</h3>
          <p className="text-[#5e8d81] text-sm font-normal mt-1">
            Muestras en las últimas 24 horas
          </p>
        </div>

        {/* Aquí utilizamos una grilla (grid) para colocar las tarjetas en fila. 
            En teléfonos se ve 1 columna, en tablets 2, y en computadoras 3. */}
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
