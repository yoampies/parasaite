// src/sections/Scanner.tsx
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
import useImageAnalysisWorker from '../hooks/UseImageAnalysisWorker';
import { Patient } from '../db/localDB';
import { parasiteTypes } from '../assets/constants';
import { IBoundingBox } from '../types';

export interface CapturedFrameData {
  blob: Blob;
  detections: IBoundingBox[];
  isProcessed?: boolean; // NUEVO: Marcador para saber si la IA ya corrió sobre este frame
}

export const Scanner: React.FC = () => {
  const navigate = useNavigate();
  const saveDiagnosis = useHistoryStore((state) => state.saveDiagnosis);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const [capturedFrames, setCapturedFrames] = useState<CapturedFrameData[]>([]);
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);

  const [showCaptureFlash, setShowCaptureFlash] = useState<boolean>(false);

  const [selectedPatient] = useState<Patient | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { detectedParasites: liveDetections, processSource } = useImageAnalysisWorker();

  const startCamera = async () => {
    setCameraError(null);
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: 'environment' },
        audio: false,
      });
      setStream(userStream);
      setIsCameraActive(true);
      setCapturedImage(null);
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
    setIsCameraActive(false);
  }, [stream]);

  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    let animationFrameId: number;

    const runLiveInference = () => {
      if (
        isCameraActive &&
        !capturedImage &&
        videoRef.current &&
        videoRef.current.readyState === 4
      ) {
        processSource(videoRef.current);
      }
      animationFrameId = requestAnimationFrame(runLiveInference);
    };

    if (isCameraActive && !capturedImage) {
      animationFrameId = requestAnimationFrame(runLiveInference);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isCameraActive, capturedImage, processSource]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video || !isCameraActive || capturedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!liveDetections || liveDetections.length === 0) return;

    liveDetections.forEach((item) => {
      const [normX1, normY1, normX2, normY2] = item.box;
      const x = normX1 * canvas.width;
      const y = normY1 * canvas.height;
      const w = (normX2 - normX1) * canvas.width;
      const h = (normY2 - normY1) * canvas.height;

      const strokeColor = item.isGreyZone ? '#f59e0b' : '#00c795';

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x, y, w, h);

      const speciesName = parasiteTypes[item.classId] || 'Parásito';
      const label = `${speciesName} ${(item.confidence * 100).toFixed(0)}%`;
      ctx.font = '600 11px Inter, sans-serif';
      const textWidth = ctx.measureText(label).width;
      const textHeight = 16;

      const labelX = x;
      const labelY = y > textHeight + 4 ? y - textHeight - 2 : y + h + 2;

      ctx.fillStyle = strokeColor;
      ctx.fillRect(labelX, labelY, textWidth + 8, textHeight);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, labelX + 4, labelY + 12);
    });
  }, [liveDetections, isCameraActive, capturedImage]);

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
          const frozenDetections = liveDetections ? [...liveDetections] : [];
          // Marcar explícitamente como procesado porque viene del stream en vivo
          setCapturedFrames((prev) => [
            ...prev,
            { blob, detections: frozenDetections, isProcessed: true },
          ]);
          setShowCaptureFlash(true);
          setTimeout(() => setShowCaptureFlash(false), 200);
        }
      }, 'image/png');
    }
  }, [liveDetections]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCapturedImage(file);
      // Marcar como NO procesado para que ScannerResults se encargue de correr el modelo
      setCapturedFrames((prev) => [...prev, { blob: file, detections: [], isProcessed: false }]);
    }
  };

  const handleProcessAnalysis = async () => {
    if (!capturedImage && capturedFrames.length === 0) return;

    setIsProcessing(true);
    try {
      const primaryImageBlob = capturedImage || capturedFrames[0]?.blob;

      const allFrameBlobs =
        capturedFrames.length > 0
          ? capturedFrames.map((f) => f.blob)
          : capturedImage
            ? [capturedImage]
            : [];

      const allDetections = capturedFrames.flatMap((f) => f.detections || []);
      const topDetection = allDetections.reduce(
        (prev, current) => (prev.confidence > current.confidence ? prev : current),
        { classId: 0, confidence: 0 }
      );

      const formattedDetections = allDetections.map((d) => ({
        class: parasiteTypes[d.classId] || 'Parásito',
        bbox: d.box,
        confidence: d.confidence,
      }));

      const formattedFrameDetections = capturedFrames.map((frame) =>
        (frame.detections || []).map((d) => ({
          class: parasiteTypes[d.classId] || 'Parásito',
          bbox: d.box,
          confidence: d.confidence,
        }))
      );

      const initialDiagnosisData = {
        patientLocalId: selectedPatient?.localId || 'PAT-LOCAL-001',
        date: new Date().toISOString(),
        parasiteFound:
          allDetections.length > 0
            ? parasiteTypes[topDetection.classId] || 'Parásito Detectado'
            : 'Sin hallazgos parasitarios',
        confidence: topDetection.confidence,
        detectedParasitesCount: allDetections.length,
        detections: formattedDetections,
        frameDetections: formattedFrameDetections,
      };

      const diagnosisId = await saveDiagnosis(initialDiagnosisData, allFrameBlobs);

      stopCamera();

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
                  Transmisión directa con detección de IA en tiempo real o carga manual de muestras.
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 flex flex-col gap-4">
                <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-[#dae7e3] shadow-inner flex items-center justify-center">
                  {showCaptureFlash && (
                    <div className="absolute inset-0 bg-white/40 z-30 pointer-events-none transition-opacity duration-200" />
                  )}

                  {!isCameraActive && !capturedImage ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <div className="p-4 bg-white/10 text-[#00c795] rounded-full">
                        <Camera className="w-10 h-10" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Cámara Inactiva</h3>
                        <p className="text-xs text-slate-400 max-w-sm">
                          Inicia el stream de video para realizar detección parasitológica en tiempo
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
                    <img
                      src={URL.createObjectURL(capturedImage)}
                      alt="Captura microscópica"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-contain z-0"
                      />
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      />
                    </>
                  )}

                  {capturedFrames.length > 0 && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/10 z-20">
                      <ImageIcon className="w-4 h-4 text-[#00c795]" />
                      <span>{capturedFrames.length} Fotograma(s)</span>
                    </div>
                  )}
                </div>

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
                      {capturedImage && (
                        <button
                          onClick={() => setCapturedImage(null)}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#5e8d81] hover:text-[#101816] transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Volver al Video en Vivo
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

              <aside className="flex flex-col gap-6">
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

                <div className="bg-[#f0f5f4] p-6 rounded-2xl border border-[#dae7e3] flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#00c795] shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-[#101816]">Procesar con IA</h4>
                      <p className="text-xs text-[#5e8d81] leading-relaxed">
                        Evaluará los fotogramas seleccionados para consolidar el diagnóstico.
                      </p>
                    </div>
                  </div>

                  {(capturedImage || capturedFrames.length > 0) && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#00c795] bg-white p-2.5 rounded-lg border border-[#dae7e3]">
                      <CheckCircle className="w-4 h-4" />
                      <span>{capturedFrames.length} muestra(s) recolectada(s)</span>
                    </div>
                  )}

                  <button
                    disabled={(!capturedImage && capturedFrames.length === 0) || isProcessing}
                    onClick={handleProcessAnalysis}
                    className={`w-full h-12 rounded-xl font-bold text-sm text-[#101816] transition-all flex items-center justify-center gap-2 ${
                      (!capturedImage && capturedFrames.length === 0) || isProcessing
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
