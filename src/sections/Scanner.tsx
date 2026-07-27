import { useEffect, useRef, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useHistoryStore } from '../hooks/UseHistoryStore';
import { Patient } from '../db/localDB';

/**
 * @description Componente de captura en tiempo real y carga de muestras para análisis microscópico.
 * Integra transmisión de video, captura de frames y persistencia inicial en Dexie.js.
 */
function Scanner() {
  const navigate = useNavigate();
  const saveDiagnosis = useHistoryStore((state) => state.saveDiagnosis);

  // --- REFS ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // --- ESTADOS DE VIDEO / CÁMARA ---
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedPatient] = useState<Patient | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Inicialización de la cámara (Microscopio / WebCam)
  useEffect(() => {
    async function startCamera() {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        setStream(userStream);
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        setCameraError(
          'No se pudo acceder a la cámara/microscopio. Verifica los permisos del dispositivo.'
        );
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Control de Grabación
  const startRecording = () => {
    if (!stream) return;
    setRecordedChunks([]);
    setVideoUrl(null);
    setCapturedImage(null);

    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks((prev) => [...prev, e.data]);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Captura de Instantánea desde el Stream
  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          setCapturedImage(blob);
          setVideoUrl(null);
        }
      }, 'image/png');
    }
  };

  // Carga manual de imagen desde archivo local
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCapturedImage(file);
      setVideoUrl(null);
    }
  };

  // Persistencia inicial en Dexie.js y Redirección a ScannerResults para inferencia YOLO
  const handleProcessAnalysis = async () => {
    if (!capturedImage && recordedChunks.length === 0) return;

    setIsProcessing(true);
    try {
      const imageBlob = capturedImage || new Blob(recordedChunks, { type: 'image/png' });

      const initialDiagnosisData = {
        patientLocalId: selectedPatient?.localId || 'PAT-LOCAL-001',
        date: new Date().toISOString(),
        parasiteFound: '',
        confidence: 0,
        detectedParasitesCount: 0,
      };

      // 1. Guardar en Dexie (Diagnóstico preliminar + Blob de imagen)
      const diagnosisId = await saveDiagnosis(initialDiagnosisData, imageBlob);

      // 2. Navegar inmediatamente a la vista de resultados para ejecutar el análisis del modelo
      navigate(`/results/${diagnosisId}`);
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
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
                <svg
                  className="w-4 h-4 text-[#00c795]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>
                  {selectedPatient
                    ? `Paciente: ${selectedPatient.name}`
                    : 'Paciente: Anónimo (Local)'}
                </span>
              </div>
            </header>

            {/* ÁREA PRINCIPAL DEL VISOR DE VIDEO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 flex flex-col gap-4">
                <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-[#dae7e3] shadow-inner flex items-center justify-center">
                  {cameraError ? (
                    <div className="p-6 text-center text-white/80 max-w-md">
                      <p className="text-sm">{cameraError}</p>
                    </div>
                  ) : capturedImage ? (
                    <img
                      src={URL.createObjectURL(capturedImage)}
                      alt="Captura microscópica"
                      className="w-full h-full object-contain"
                    />
                  ) : videoUrl ? (
                    <video src={videoUrl} controls className="w-full h-full object-contain" />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-contain"
                    />
                  )}

                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1.5 rounded-full text-xs font-semibold animate-pulse backdrop-blur-md">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      GRABANDO STREAM...
                    </div>
                  )}
                </div>

                {/* CONTROLES DE CAPTURA Y GRABACIÓN */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#dae7e3]">
                  <div className="flex items-center gap-2">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm rounded-xl transition-all"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Grabar Video
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 font-semibold text-sm rounded-xl transition-all"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M6 6h12v12H6z" />
                        </svg>
                        Detener
                      </button>
                    )}

                    <button
                      onClick={captureFrame}
                      className="flex items-center gap-2 px-4 py-2 bg-[#f0f5f4] text-[#101816] hover:bg-[#e0ece8] font-semibold text-sm rounded-xl transition-all"
                    >
                      <svg
                        className="w-4 h-4 text-[#00c795]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Capturar Frame
                    </button>
                  </div>

                  {(capturedImage || videoUrl) && (
                    <button
                      onClick={() => {
                        setCapturedImage(null);
                        setVideoUrl(null);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#5e8d81] hover:text-[#101816] transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Reintentar Toma
                    </button>
                  )}
                </div>
              </section>

              {/* PANEL LATERAL DE CARGA Y PROCESAMIENTO */}
              <aside className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl border border-[#dae7e3]">
                  <h3 className="text-[#101816] text-base font-bold flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-[#00c795]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Carga Alternativa
                  </h3>
                  <p className="text-[#5e8d81] text-xs leading-relaxed">
                    Si dispones de un archivo en alta definición (PNG, JPG) guardado previamente,
                    puedes subirlo directamente.
                  </p>

                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#dae7e3] hover:border-[#00c795] rounded-xl cursor-pointer bg-[#fbfcfc] hover:bg-[#f0f5f4] transition-all group">
                    <svg
                      className="w-8 h-8 text-[#5e8d81] group-hover:text-[#00c795] transition-colors mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
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

                {/* BOTÓN FINAL DE PROCESAMIENTO */}
                <div className="bg-[#f0f5f4] p-6 rounded-2xl border border-[#dae7e3] flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-[#00c795] shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-[#101816]">Procesar con IA</h4>
                      <p className="text-xs text-[#5e8d81] leading-relaxed">
                        El modelo YOLOv8 detectará estructuras parasitarias y guardará el registro
                        en la base de datos local.
                      </p>
                    </div>
                  </div>

                  {capturedImage && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#00c795] bg-white p-2.5 rounded-lg border border-[#dae7e3]">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Muestra lista para evaluación
                    </div>
                  )}

                  <button
                    disabled={(!capturedImage && recordedChunks.length === 0) || isProcessing}
                    onClick={handleProcessAnalysis}
                    className={`w-full h-12 rounded-xl font-bold text-sm text-[#101816] transition-all flex items-center justify-center gap-2 ${
                      (!capturedImage && recordedChunks.length === 0) || isProcessing
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
}

export default Scanner;
