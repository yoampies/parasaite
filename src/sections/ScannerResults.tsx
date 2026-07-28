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
  parasiteTypes,
} from '../assets/constants';
import { IAnalysis, IDetectedParasite, IBoundingBox } from '../types';
import useImageAnalysisWorker from '../hooks/UseImageAnalysisWorker';
import { useHistoryStore } from '../hooks/UseHistoryStore';
import { db, DetectionDetail } from '../db/localDB';

/**
 * @description Componente de visualización de resultados diagnósticos.
 * Recupera la muestra desde Dexie.js o estado local. Si ya fue analizada previamente,
 * recupera las detecciones guardadas sin volver a correr el modelo YOLO.
 */
function ScannerResults() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const loadFrameForDiagnosis = useHistoryStore((state) => state.loadFrameForDiagnosis);

  // --- 1. ESTADO ---
  const [analysis, setAnalysis] = useState<IAnalysis | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [savedDetections, setSavedDetections] = useState<IBoundingBox[] | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [isFetchingLocal, setIsFetchingLocal] = useState<boolean>(true);

  // --- 2. REFS PARA PROCESAMIENTO Y CANVAS ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  // --- 3. RECUPERACIÓN DE LA MUESTRA DESDE DEXIE ---
  useEffect(() => {
    let isMounted = true;
    let createdUrl = '';

    const fetchAnalysisData = async () => {
      setIsFetchingLocal(true);

      const stateAnalysis = (location.state as { analysis?: IAnalysis })?.analysis;

      if (analysisId && !isNaN(Number(analysisId))) {
        const idNum = Number(analysisId);
        try {
          const diagRecord = await db.diagnoses.get(idNum);
          if (diagRecord && isMounted) {
            // Cargar imagen desde la tabla de frames en Dexie
            const blob = await loadFrameForDiagnosis(idNum);
            if (blob) {
              createdUrl = URL.createObjectURL(blob);
              setImageUrl(createdUrl);
            } else if (stateAnalysis?.imgURL) {
              setImageUrl(stateAnalysis.imgURL);
            }

            // Si el diagnóstico ya contiene detecciones guardadas, las establecemos
            if (diagRecord.detections && diagRecord.detections.length > 0) {
              const mappedBoxes: IBoundingBox[] = diagRecord.detections.map(
                (d: DetectionDetail) => {
                  const classIdx = parasiteTypes.indexOf(d.class);
                  return {
                    box: d.bbox,
                    classId: classIdx !== -1 ? classIdx : 0,
                    confidence: d.confidence,
                    isGreyZone: d.confidence < 0.6,
                  };
                }
              );
              setSavedDetections(mappedBoxes);
            }

            const mappedAnalysis: IAnalysis = {
              id: diagRecord.id || idNum,
              date: diagRecord.date,
              content: diagRecord.parasiteFound || 'Análisis completado',
              imgURL: createdUrl || stateAnalysis?.imgURL || '',
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

      // Si no se encontró en Dexie, buscar en estado o en constantes
      if (stateAnalysis && isMounted) {
        setAnalysis(stateAnalysis);
        if (stateAnalysis.imgURL) setImageUrl(stateAnalysis.imgURL);
        setIsFetchingLocal(false);
        return;
      }

      const localData = localStorage.getItem('recentAnalyses');
      const localAnalyses: IAnalysis[] = localData ? JSON.parse(localData) : [];

      const allData = [
        ...localAnalyses,
        ...recentAnalysesConstant,
        ...recentImagesConstant,
      ] as IAnalysis[];

      const foundAnalysis = allData.find((a) => a.id.toString() === analysisId);
      if (isMounted) {
        setAnalysis(foundAnalysis || null);
        if (foundAnalysis?.imgURL) setImageUrl(foundAnalysis.imgURL);
        setIsFetchingLocal(false);
      }
    };

    fetchAnalysisData();

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [analysisId, location.state, loadFrameForDiagnosis]);

  // --- 4. HOOK DEL WORKER DE IA ---
  const { detectedParasites: liveDetections, isLoading, processSource } = useImageAnalysisWorker();

  // --- 5. INFERENCIA CON YOLOV8 (SOLO SI ES UNA MUESTRA NUEVA SIN DETECCIONES GUARDADAS) ---
  useEffect(() => {
    if (imageLoaded && imgRef.current && !savedDetections) {
      processSource(imgRef.current);
    }
  }, [imageLoaded, processSource, savedDetections]);

  // Determinar si usamos detecciones ya guardadas o las recién procesadas
  const activeDetections = useMemo(() => {
    return savedDetections || liveDetections || [];
  }, [savedDetections, liveDetections]);

  // --- 6. DIBUJAR BOUNDING BOXES EXACTOS SOBRE CADA PARÁSITO ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (
      !activeDetections ||
      activeDetections.length === 0 ||
      !img.naturalWidth ||
      !img.naturalHeight
    )
      return;

    activeDetections.forEach((item) => {
      const [normX1, normY1, normX2, normY2] = item.box;

      const x = normX1 * canvas.width;
      const y = normY1 * canvas.height;
      const w = (normX2 - normX1) * canvas.width;
      const h = (normY2 - normY1) * canvas.height;

      ctx.strokeStyle = item.isGreyZone ? '#f59e0b' : '#00c795';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x, y, w, h);

      const label = `${parasiteTypes[item.classId] || 'Parásito'} ${(item.confidence * 100).toFixed(0)}%`;
      ctx.font = '600 11px Inter, sans-serif';
      const textMetrics = ctx.measureText(label);
      const textWidth = textMetrics.width;
      const textHeight = 16;

      const labelX = x;
      const labelY = y > textHeight + 4 ? y - textHeight - 2 : y + h + 2;

      ctx.fillStyle = item.isGreyZone ? '#f59e0b' : '#00c795';
      ctx.fillRect(labelX, labelY, textWidth + 8, textHeight);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, labelX + 4, labelY + 12);
    });
  }, [activeDetections, imageLoaded]);

  // --- 7. LÓGICA DE AGREGACIÓN DE RESULTADOS ---
  const aggregatedData = useMemo<IDetectedParasite[]>(() => {
    if (!activeDetections || activeDetections.length === 0) return [];

    const parasitesMap = (activeDetections as IBoundingBox[]).reduce(
      (acc, currentBox) => {
        const label = parasiteTypes[currentBox.classId] || `Especie ${currentBox.classId}`;
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
  }, [activeDetections]);

  // --- 8. ACTUALIZACIÓN AUTOMÁTICA EN DEXIE.JS AL FINALIZAR LA INFERENCIA INICIAL ---
  useEffect(() => {
    // Si las detecciones ya existían en la BD, no sobrescribimos
    if (savedDetections || isLoading || !analysisId || isNaN(Number(analysisId))) return;

    const idNum = Number(analysisId);

    if (liveDetections && liveDetections.length > 0) {
      const topParasite = aggregatedData[0];

      // Mapear detecciones para persistir en Dexie
      const formattedDetections: DetectionDetail[] = liveDetections.map((d) => ({
        bbox: d.box,
        class: parasiteTypes[d.classId] || 'Desconocido',
        confidence: d.confidence,
      }));

      db.diagnoses
        .update(idNum, {
          parasiteFound: topParasite ? topParasite.label : 'Parásito detectado',
          confidence: topParasite ? topParasite.value / 100 : 0.8,
          detectedParasitesCount: liveDetections.length,
          detections: formattedDetections,
        })
        .catch((err) => {
          console.error('Error al actualizar resultados de IA en Dexie:', err);
        });
    } else if (liveDetections && liveDetections.length === 0 && imageLoaded) {
      db.diagnoses
        .update(idNum, {
          parasiteFound: 'Sin hallazgos parasitarios',
          confidence: 1.0,
          detectedParasitesCount: 0,
          detections: [],
        })
        .catch((err) => {
          console.error('Error al actualizar resultado negativo en Dexie:', err);
        });
    }
  }, [isLoading, aggregatedData, liveDetections, savedDetections, analysisId, imageLoaded]);

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

            <section
              className="flex w-full grow bg-white p-4 justify-center items-center"
              ref={scannerContainerRef}
            >
              {/* Contenedor ajustado estrictamente a la imagen para evitar desalineaciones con canvas y recuadros */}
              <div className="relative inline-block max-w-full bg-gray-50 rounded-lg border border-[#dae7e3] overflow-hidden">
                {imageUrl && (
                  <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Muestra microscópica"
                    className="max-h-[500px] w-auto block object-contain rounded-lg z-0"
                    onLoad={() => setImageLoaded(true)}
                  />
                )}

                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                />

                {/* Capa opcional para HTML overlays basados en porcentajes si se requiere */}
                <div className="absolute inset-0 pointer-events-none z-20">
                  {activeDetections.map((detection, index) => {
                    const [normX1, normY1, normX2, normY2] = detection.box;
                    const left = normX1 * 100;
                    const top = normY1 * 100;
                    const width = (normX2 - normX1) * 100;
                    const height = (normY2 - normY1) * 100;

                    return (
                      <div
                        key={index}
                        className="absolute border-2 border-emerald-400 bg-emerald-500/10 rounded-sm"
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          width: `${width}%`,
                          height: `${height}%`,
                        }}
                      >
                        <span className="absolute -top-6 left-0 bg-emerald-500 text-white text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                          {parasiteTypes[detection.classId] || 'Parásito'}{' '}
                          {Math.round(detection.confidence * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* OVERLAY DE CARGA SOLO CUANDO REALMENTE SE ESTá EJECUTANDO EL WORKER NUEVO */}
              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/60 text-white backdrop-blur-sm flex-col z-30 transition-opacity duration-500 ${
                  isLoading && !savedDetections ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <p className="text-lg font-medium">Analizando morfología con IA...</p>
                <div className="w-4/5 h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-[#00c795] animate-pulse w-full" />
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
