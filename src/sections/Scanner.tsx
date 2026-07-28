import React, { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Image as ImageIcon,
  CheckCircle,
  Play,
  RefreshCw,
  Upload,
  Sparkles,
} from 'lucide-react';

import { useHistoryStore } from '../hooks/UseHistoryStore';
import { Patient } from '../db/localDB';

/**
 * @description Componente de captura en tiempo real y carga de muestras para análisis microscópico.
 * Integra cámara On-Demand, transmisión de video, capturas múltiples de fotogramas y persistencia en Dexie.js.
 */
export const Scanner: React.FC = () => {
  const navigate = useNavigate();
  const saveDiagnosis = useHistoryStore((state) => state.saveDiagnosis);

  // --- REFS ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // --- ESTADOS DE CÁMARA Y NAVEGACIÓN ---
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // --- ESTADOS DE CAPTURA Y GRABACIÓN ---
  const [capturedFrames, setCapturedFrames] = useState<Blob[]>([]);
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedChunks] = useState<Blob[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // --- ESTADOS DE PACIENTE Y PROCESAMIENTO ---
  const [selectedPatient] = useState<Patient | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Control de inicio / apagado de la cámara On-Demand
  const startCamera = async () => {
    setCameraError(null);
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: 'environment' },
        audio: false,
      });
      setStream(userStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setCameraError(
        'No se pudo acceder a la cámara/microscopio. Verifica los permisos del dispositivo.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    setIsCameraActive(false);
  }, [stream, isRecording]);

  // Asignar stream al elemento <video> cuando se active la cámara
  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Capturar un fotograma desde el stream de video activo (Guarda en la lista y como previsualización)
  const captureFrame = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          setCapturedFrames((prev) => [...prev, blob]);
          setCapturedImage(blob);
          setVideoUrl(null);
        }
      }, 'image/png');
    }
  }, []);

  // Carga manual de archivo local
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCapturedImage(file);
      setCapturedFrames((prev) => [...prev, file]);
      setVideoUrl(null);
    }
  };

  // Guardado en Dexie.js y navegación a Resultados
  const handleProcessAnalysis = async () => {
    if (!capturedImage && capturedFrames.length === 0 && recordedChunks.length === 0) return;

    setIsProcessing(true);
    try {
      // Usar la última imagen capturada, o la primera del grupo, o el fallback del video grab
      const primaryImageBlob =
        capturedImage || capturedFrames[0] || new Blob(recordedChunks, { type: 'image/png' });

      const initialDiagnosisData = {
        patientLocalId: selectedPatient?.localId || 'PAT-LOCAL-001',
        date: new Date().toISOString(),
        parasiteFound: '',
        confidence: 0,
        detectedParasitesCount: 0,
      };

      // 1. Persistencia inicial en Dexie
      const diagnosisId = await saveDiagnosis(initialDiagnosisData, primaryImageBlob);

      // Desactivar hardware antes de la navegación
      stopCamera();

      // 2. Navegar pasando las capturas recolectadas y el id del diagnóstico
      navigate(`/results/${diagnosisId}`, {
        state: { capturedFrames, primaryImageBlob },
      });
    } catch (error) {
      console.error('Error al iniciar la sesión de análisis en Dexie:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#f8faf9] font-inter overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 justify-center p-4 sm:p-6">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-6">
            {/* ENCABEZADO */}
            <header className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-[#dae7e3] shadow-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-[#e8f7f3] text-[#00c795] rounded-lg">
                    <Camera className="w-6 h-6" />
                  </span>
                  <h1 className="text-[#101816] tracking-light text-2xl font-bold">
                    Escáner Microscópico en Vivo
                  </h1>
                </div>
                <p className="text-[#5e8d81] text-sm">
                  Transmisión directa desde la cámara del microscopio o carga manual de muestras.
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#dae7e3] bg-[#fbfcfc] text-[#101816] font-medium text-sm">
                <span className="w-2 h-2 rounded-full bg-[#00c795]" />
                <span>
                  {selectedPatient
                    ? `Paciente: ${selectedPatient.name}`
                    : 'Paciente: Anónimo (Local)'}
                </span>
              </div>
            </header>

            {/* ÁREA PRINCIPAL */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 flex flex-col gap-4">
                {/* VISOR DE CÁMARA / IMAGEN */}
                <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-[#dae7e3] shadow-inner flex items-center justify-center">
                  {/* ESTADO 1: Cámara Inactiva */}
                  {!isCameraActive && !capturedImage && !videoUrl ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <div className="p-4 bg-white/10 text-[#00c795] rounded-full">
                        <Camera className="w-10 h-10" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Cámara Inactiva</h3>
                        <p className="text-xs text-slate-400 max-w-sm">
                          Inicia el stream de video para realizar capturas del microscopio en tiempo
                          real.
                        </p>
                      </div>
                      {cameraError && (
                        <p className="text-xs text-red-400 max-w-sm">{cameraError}</p>
                      )}
                      <button
                        onClick={startCamera}
                        className="flex items-center gap-2 bg-[#00c795] hover:bg-[#00a67d] text-[#101816] font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Iniciar Cámara y Análisis
                      </button>
                    </div>
                  ) : capturedImage ? (
                    /* PREVISUALIZACIÓN DE IMAGEN CAPTURADA / SUBIDA */
                    <img
                      src={URL.createObjectURL(capturedImage)}
                      alt="Captura microscópica"
                      className="w-full h-full object-contain"
                    />
                  ) : videoUrl ? (
                    /* PREVISUALIZACIÓN DE VIDEO GRABADO */
                    <video src={videoUrl} controls className="w-full h-full object-contain" />
                  ) : (
                    /* STREAM ACTIVO DE VIDEO */
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-contain"
                    />
                  )}

                  {/* INDICADORES FLOTANTES SOBRE EL VISOR */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1.5 rounded-full text-xs font-semibold animate-pulse backdrop-blur-md">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      GRABANDO STREAM...
                    </div>
                  )}

                  {capturedFrames.length > 0 && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/10">
                      <ImageIcon className="w-4 h-4 text-[#00c795]" />
                      <span>{capturedFrames.length} Fotogramas</span>
                    </div>
                  )}
                </div>

                {/* CONTROLES DE CAPTURA Y GRABACIÓN */}
                {isCameraActive && (
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#dae7e3]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={captureFrame}
                        className="flex items-center gap-2 px-4 py-2 bg-[#e8f7f3] text-[#00c795] hover:bg-[#00c795]/20 font-semibold text-sm rounded-xl transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        Capturar Fotograma
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {(capturedImage || videoUrl) && (
                        <button
                          onClick={() => {
                            setCapturedImage(null);
                            setVideoUrl(null);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#5e8d81] hover:text-[#101816] transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Reintentar Toma
                        </button>
                      )}

                      <button
                        onClick={stopCamera}
                        className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Apagar Cámara
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* PANEL LATERAL DE CARGA Y PROCESAMIENTO */}
              <aside className="flex flex-col gap-6">
                {/* SECCIÓN CARGA ALTERNATIVA */}
                <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl border border-[#dae7e3]">
                  <h3 className="text-[#101816] text-base font-bold flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#00c795]" />
                    Carga Alternativa
                  </h3>
                  <p className="text-[#5e8d81] text-xs leading-relaxed">
                    Si dispones de un archivo guardado previamente (PNG, JPG), puedes subirlo
                    directamente al flujo de análisis.
                  </p>

                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#dae7e3] hover:border-[#00c795] rounded-xl cursor-pointer bg-[#fbfcfc] hover:bg-[#f0f5f4] transition-all group">
                    <Upload className="w-8 h-8 text-[#5e8d81] group-hover:text-[#00c795] transition-colors mb-2" />
                    <span className="text-xs font-semibold text-[#101816]">Subir imagen</span>
                    <span className="text-[11px] text-[#5e8d81]">Soporta PNG, JPG o WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* ACCIÓN PRINCIPAL DE INFERENCIA DE IA */}
                <div className="bg-[#f0f5f4] p-6 rounded-2xl border border-[#dae7e3] flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#00c795] shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-[#101816]">Procesar con IA</h4>
                      <p className="text-xs text-[#5e8d81] leading-relaxed">
                        El modelo YOLOv8 evaluará las capturas para detectar estructuras
                        parasitarias y guardar el registro local.
                      </p>
                    </div>
                  </div>

                  {(capturedImage || capturedFrames.length > 0) && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#00c795] bg-white p-2.5 rounded-lg border border-[#dae7e3]">
                      <CheckCircle className="w-4 h-4" />
                      <span>{capturedFrames.length} muestra(s) lista(s) para evaluación</span>
                    </div>
                  )}

                  <button
                    disabled={
                      (!capturedImage &&
                        capturedFrames.length === 0 &&
                        recordedChunks.length === 0) ||
                      isProcessing
                    }
                    onClick={handleProcessAnalysis}
                    className={`w-full h-12 rounded-xl font-bold text-sm text-[#101816] transition-all flex items-center justify-center gap-2 ${
                      (!capturedImage &&
                        capturedFrames.length === 0 &&
                        recordedChunks.length === 0) ||
                      isProcessing
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#00c795] hover:bg-[#00a67d] shadow-md shadow-[#00c795]/20'
                    }`}
                  >
                    {isProcessing ? 'Procesando e Indexando...' : 'Iniciar Análisis de Muestra'}
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Scanner;
