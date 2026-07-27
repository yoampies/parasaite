import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// Componentes
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
import { useHistoryStore } from '../hooks/UseHistoryStore';
import { db } from '../db/localDB';

// Diccionario de mapeo clínico
const CLASS_LABELS: Record<number, string> = {
  0: 'Ascaris lumbricoides',
  1: 'Giardia duodenalis',
  2: 'Blastocystis hominis',
  3: 'Enterobius vermicularis',
  4: 'Necator americanus',
  5: 'Trichuris trichiura',
};

/**
 * @description Componente de visualización de resultados diagnósticos.
 * Recupera la muestra desde Dexie.js, procesa la inferencia morfológica con YOLOv8
 * y actualiza el diagnóstico en la base de datos local al finalizar.
 */
function ScannerResults() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const loadFrameForDiagnosis = useHistoryStore((state) => state.loadFrameForDiagnosis);

  // --- 1. ESTADO ---
  const [analysis, setAnalysis] = useState<IAnalysis | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [isFetchingLocal, setIsFetchingLocal] = useState<boolean>(true);

  // --- 2. REFS PARA PROCESAMIENTO Y CANVAS ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  // --- 3. RECUPERACIÓN DE LA MUESTRA DESDE DEXIE ---
  useEffect(() => {
    let activeObjectUrl: string | null = null;

    const fetchAnalysisData = async () => {
      setIsFetchingLocal(true);

      // A) Comprobar si el análisis viene por state de react-router
      const stateAnalysis = (location.state as { analysis?: IAnalysis })?.analysis;
      if (stateAnalysis) {
        setAnalysis(stateAnalysis);
        setIsFetchingLocal(false);
        return;
      }

      // B) Consultar directamente en Dexie por ID
      if (analysisId && !isNaN(Number(analysisId))) {
        const idNum = Number(analysisId);
        try {
          const diagRecord = await db.diagnoses.get(idNum);
          if (diagRecord) {
            const blob = await loadFrameForDiagnosis(idNum);
            activeObjectUrl = blob ? URL.createObjectURL(blob) : '';

            const mappedAnalysis: IAnalysis = {
              id: diagRecord.id || idNum,
              date: diagRecord.date,
              content: diagRecord.parasiteFound || 'Análisis en curso...',
              imgURL: activeObjectUrl,
              detectedParasites: [],
              fileName: `muestra_${diagRecord.id || idNum}.jpg`,
            };

            setAnalysis(mappedAnalysis);
            setIsFetchingLocal(false);
            return;
          }
        } catch (error) {
          console.error('Error al leer diagnóstico desde Dexie:', error);
        }
      }

      // C) Fallback a LocalStorage o Mocks
      const localData = localStorage.getItem('recentAnalyses');
      const localAnalyses: IAnalysis[] = localData ? JSON.parse(localData) : [];

      const allData = [
        ...localAnalyses,
        ...recentAnalysesConstant,
        ...recentImagesConstant,
      ] as IAnalysis[];

      const foundAnalysis = allData.find((a) => a.id.toString() === analysisId);
      setAnalysis(foundAnalysis || null);
      setIsFetchingLocal(false);
    };

    fetchAnalysisData();

    return () => {
      if (activeObjectUrl) {
        URL.revokeObjectURL(activeObjectUrl);
      }
    };
  }, [analysisId, location.state, loadFrameForDiagnosis]);

  // --- 4. HOOK DEL WORKER DE IA ---
  const { detectedParasites, isLoading, processSource } = useImageAnalysisWorker();

  // --- 5. INFERENCIA CON YOLOV8 AL CARGAR LA IMAGEN EN EL DOM ---
  useEffect(() => {
    if (imageLoaded && imgRef.current) {
      processSource(imgRef.current);
    }
  }, [imageLoaded, processSource]);

  // --- 6. DIBUJAR BOUNDING BOXES EN EL CANVAS ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sincronizar dimensiones del canvas con el elemento de imagen renderizado
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!detectedParasites || detectedParasites.length === 0) return;

    // Calcular el área de renderizado real de la imagen considerando CSS `object-contain`
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = canvas.width / canvas.height;

    let renderWidth = canvas.width;
    let renderHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (containerRatio > imgRatio) {
      renderWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - renderWidth) / 2;
    } else {
      renderHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - renderHeight) / 2;
    }

    // Escalas de proyección desde la resolución nativa de la imagen original hacia el viewport
    const scaleX = renderWidth / img.naturalWidth;
    const scaleY = renderHeight / img.naturalHeight;

    detectedParasites.forEach((item) => {
      // Formato proveniente del worker: [rawX_px, rawY_px, rawW_px, rawH_px]
      const [rawX, rawY, rawW, rawH] = item.box;

      const x = offsetX + rawX * scaleX;
      const y = offsetY + rawY * scaleY;
      const w = rawW * scaleX;
      const h = rawH * scaleY;

      // Color del borde de la caja
      ctx.strokeStyle = item.isGreyZone ? '#f59e0b' : '#00c795';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      // Dibujar etiqueta
      const label = `${CLASS_LABELS[item.classId] || 'Parásito'} ${(item.confidence * 100).toFixed(0)}%`;
      ctx.fillStyle = item.isGreyZone ? '#f59e0b' : '#00c795';
      ctx.font = 'bold 12px Inter, sans-serif';
      const textWidth = ctx.measureText(label).width;

      const labelY = y > 22 ? y - 22 : y;
      ctx.fillRect(x, labelY, textWidth + 10, 20);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, x + 5, labelY + 14);
    });
  }, [detectedParasites, imageLoaded]);

  // --- 7. LÓGICA DE AGREGACIÓN DE RESULTADOS ---
  const aggregatedData = useMemo<IDetectedParasite[]>(() => {
    if (!detectedParasites || detectedParasites.length === 0) return [];

    const parasitesMap = (detectedParasites as IBoundingBox[]).reduce(
      (acc, currentBox) => {
        const label = CLASS_LABELS[currentBox.classId] || `Especie ${currentBox.classId}`;
        const value = currentBox.confidence;

        if (acc[label]) {
          acc[label].sum += value;
          acc[label].count += 1;
        } else {
          acc[label] = { label, sum: value, count: 1 };
        }
        return acc;
      },
      {} as Record<string, { label: string; sum: number; count: number }>
    );

    return Object.values(parasitesMap).map((p) => ({
      label: p.label,
      value: Number(((p.sum / p.count) * 100).toFixed(2)),
    }));
  }, [detectedParasites]);

  // --- 8. ACTUALIZACIÓN AUTOMÁTICA EN DEXIE.JS AL FINALIZAR LA INFERENCIA ---
  useEffect(() => {
    if (isLoading || !analysisId || isNaN(Number(analysisId))) return;

    const idNum = Number(analysisId);

    if (aggregatedData.length > 0) {
      const topParasite = aggregatedData[0];
      db.diagnoses
        .update(idNum, {
          parasiteFound: topParasite.label,
          confidence: topParasite.value / 100,
          detectedParasitesCount: detectedParasites.length,
        })
        .catch((err) => {
          console.error('Error al actualizar resultados de IA en Dexie:', err);
        });
    } else if (detectedParasites && detectedParasites.length === 0 && imageLoaded) {
      db.diagnoses
        .update(idNum, {
          parasiteFound: 'Sin hallazgos parasitarios',
          confidence: 1.0,
          detectedParasitesCount: 0,
        })
        .catch((err) => {
          console.error('Error al actualizar resultado negativo en Dexie:', err);
        });
    }
  }, [isLoading, aggregatedData, detectedParasites, analysisId, imageLoaded]);

  const handleSendFeedback = () => {
    if (analysis) {
      localStorage.setItem('currentAnalysis', JSON.stringify(analysis));
      navigate(`/feedback/${analysisId}`);
    }
  };

  if (isFetchingLocal) {
    return (
      <div className="flex size-full min-h-screen items-center justify-center bg-white font-inter">
        <p className="text-sm font-medium text-[#5e8d81]">
          Recuperando muestra desde la base de datos local...
        </p>
      </div>
    );
  }

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

            <section className="flex w-full grow bg-white p-4" ref={scannerContainerRef}>
              <div className="w-full gap-1 overflow-hidden bg-gray-50 aspect-[3/2] rounded-lg flex relative border border-[#dae7e3] items-center justify-center">
                {analysis.imgURL && (
                  <img
                    ref={imgRef}
                    src={analysis.imgURL}
                    alt="Muestra microscópica"
                    className="max-h-full max-w-full object-contain z-0"
                    onLoad={() => setImageLoaded(true)}
                  />
                )}

                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
                />

                {/* OVERLAY DE CARGA MIENTRAS EL MODELO REALIZA LA DETECCIÓN */}
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-black/60 text-white backdrop-blur-sm flex-col z-20 transition-opacity duration-500 ${
                    isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="text-lg font-medium">Analizando morfología con IA...</p>
                  <div className="w-4/5 h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-[#00c795] animate-pulse w-full" />
                  </div>
                </div>
              </div>
            </section>

            <section className="px-4 py-3">
              <h3 className="text-[#101816] text-lg font-bold leading-tight mb-4">
                Parásitos Identificados
              </h3>
              <Table
                parasites={aggregatedData.length > 0 ? aggregatedData : analysis.detectedParasites}
              />
            </section>
          </div>

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
