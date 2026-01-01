import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// Componentes
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import HorizontalBarChart from '../components/HorizontalBarChart';
import Error from '../components/Error';

// Constantes y Tipos
import {
  recentAnalyses as recentAnalysesConstant,
  recentImages as recentImagesConstant,
} from '../assets/constants';
import { IAnalysis, IDetectedParasite, IBoundingBox } from '../types';
import useImageAnalysisWorker from '../hooks/UseImageAnalysisWorker';

/**
 * @description Componente de visualización de resultados diagnósticos.
 * Integra Web Worker para segmentación y OffscreenCanvas para renderizado.
 */
function ScannerResults() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // --- 1. ESTADO ---
  const [analysis, setAnalysis] = useState<IAnalysis | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // --- 2. REFS PARA WORKER ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  // --- 3. RECUPERACIÓN DE DATOS (Lógica restaurada) ---
  useEffect(() => {
    // Intentamos obtener el análisis del estado de navegación (más rápido)
    const stateAnalysis = (location.state as { analysis?: IAnalysis })?.analysis;

    if (stateAnalysis) {
      setAnalysis(stateAnalysis);
      return;
    }

    // Si no está en el estado (ej. recarga de página), buscamos en almacenamiento local y constantes
    const localData = localStorage.getItem('recentAnalyses');
    const localAnalyses: IAnalysis[] = localData ? JSON.parse(localData) : [];

    // Unificamos fuentes de datos
    const allData = [
      ...localAnalyses,
      ...recentAnalysesConstant,
      ...recentImagesConstant,
    ] as IAnalysis[];

    const foundAnalysis = allData.find((a) => a.id.toString() === analysisId);

    setAnalysis(foundAnalysis || null);
  }, [analysisId, location.state]);

  // --- 4. INTEGRACIÓN DEL WORKER ---
  // Nota: Ya no pasamos 'drawCanvas' porque el worker dibuja solo en el OffscreenCanvas
  const { detectedParasites, isLoading } = useImageAnalysisWorker(
    imageLoaded,
    analysis,
    imgRef, // Pasamos refs para que el hook gestione el canvas transferible
    canvasRef,
    progressBarRef,
    scannerContainerRef
  );

  // --- 5. LÓGICA DE AGREGACIÓN (Calcula estadísticas basadas en lo que detecta el Worker) ---
  const aggregatedData = useMemo<IDetectedParasite[]>(() => {
    if (!detectedParasites || detectedParasites.length === 0) return [];

    const parasitesMap = (detectedParasites as IBoundingBox[]).reduce(
      (acc, currentBox) => {
        // Asumimos que cada caja tiene al menos un parásito detectado
        if (currentBox.detectedParasites && currentBox.detectedParasites.length > 0) {
          const parasite = currentBox.detectedParasites[0];
          const { label, value } = parasite;

          if (acc[label]) {
            acc[label].sum += value;
            acc[label].count += 1;
          } else {
            acc[label] = { label, sum: value, count: 1 };
          }
        }
        return acc;
      },
      {} as Record<string, { label: string; sum: number; count: number }>
    );

    return Object.values(parasitesMap).map((p) => ({
      label: p.label,
      value: Number((p.sum / p.count).toFixed(2)),
    }));
  }, [detectedParasites]);

  const handleSendFeedback = () => {
    if (analysis) {
      localStorage.setItem('currentAnalysis', JSON.stringify(analysis));
      navigate(`/feedback/${analysisId}`);
    }
  };

  // Renderizado de Error si no hay datos
  if (!analysis) {
    return (
      <Error
        title="Análisis no localizado"
        message="No pudimos recuperar los datos de esta muestra biológica."
        linkText="Volver al historial"
        linkTo="/history"
      />
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white font-inter overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <main className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
            <header className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="w-fit text-sm text-[#5e8d81] hover:underline"
                >
                  ← Volver
                </button>
                <h1 className="text-[#101816] tracking-light text-[32px] font-bold leading-tight">
                  Resultados del Análisis
                </h1>
              </div>
            </header>

            {/* --- VISOR DE IMAGEN Y CANVAS (CORE) --- */}
            <section className="flex w-full grow bg-white p-4" ref={scannerContainerRef}>
              <div className="w-full gap-1 overflow-hidden bg-gray-50 aspect-[3/2] rounded-lg flex relative border border-[#dae7e3] items-center justify-center">
                {/* 1. Imagen (Capa Base) */}
                {analysis.imgURL && (
                  <img
                    ref={imgRef}
                    src={analysis.imgURL}
                    alt="Muestra microscópica"
                    crossOrigin="anonymous"
                    className="max-h-full max-w-full object-contain z-0"
                    onLoad={() => setImageLoaded(true)}
                  />
                )}

                {/* 2. Canvas (Capa Superior - Transferida al Worker) */}
                {/* Es crucial que tenga pointer-events-none para no bloquear interacciones y absolute para superponerse */}
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
                />

                {/* 3. Overlay de Carga */}
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-black/60 text-white backdrop-blur-sm flex-col z-20 transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <p className="text-lg font-medium">Analizando morfología...</p>
                  <div className="w-4/5 h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                    <div
                      ref={progressBarRef}
                      className="h-full bg-[#00c795] transition-all duration-300"
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Tablas de resultados cualitativos */}
            <section className="px-4 py-3">
              <h3 className="text-[#101816] text-lg font-bold leading-tight mb-4">
                Parásitos Identificados
              </h3>
              {/* Usamos aggregatedData calculado desde el Worker, o fallbacks al análisis estático si el worker aun no termina */}
              <Table
                parasites={aggregatedData.length > 0 ? aggregatedData : analysis.detectedParasites}
              />
            </section>
          </div>

          {/* Panel Lateral: Resumen Estadístico */}
          <aside className="layout-content-container flex flex-col w-[360px] hidden xl:flex">
            <h3 className="text-[#101816] text-lg font-bold leading-tight px-4 pb-2 pt-4">
              Distribución de Confianza
            </h3>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dae7e3] p-6 bg-[#fbfcfc]">
                <p className="text-[#101816] text-sm font-medium uppercase text-gray-500">
                  Promedio por Especie
                </p>
                <div className="h-[250px]">
                  <HorizontalBarChart
                    data={aggregatedData.length > 0 ? aggregatedData : analysis.detectedParasites}
                  />
                </div>
              </div>
            </div>

            <section className="p-4 bg-[#f0f5f4] m-4 rounded-xl border border-[#dae7e3]">
              <h3 className="text-[#101816] text-lg font-bold leading-tight mb-2">
                Validación Humana
              </h3>
              <p className="text-[#5e8d81] text-sm leading-normal mb-4">
                Como profesional de salud, tu validación es vital. Reporta falsos positivos o
                errores de segmentación.
              </p>
              <button
                className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-[#00c795] text-[#101816] text-sm font-bold hover:bg-[#00a67d] transition-colors"
                onClick={handleSendFeedback}
              >
                Enviar Feedback Clínico
              </button>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default ScannerResults;
