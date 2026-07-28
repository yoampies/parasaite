// src/sections/ScannerResults.tsx
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
import { db, DetectionDetail, Diagnosis } from '../db/localDB';

/**
 * @description Componente de visualización de resultados diagnósticos.
 * Recupera la muestra desde Dexie.js o estado local. Incluye validación médica (Active Learning) y exportaciones.
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
  const [patientLocalId, setPatientLocalId] = useState<string>('N/A');

  // Estados de validación clínica (Active Learning)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('');
  const [isSubmittingValidation, setIsSubmittingValidation] = useState<boolean>(false);

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
            setPatientLocalId(diagRecord.patientLocalId || 'N/A');

            const blob = await loadFrameForDiagnosis(idNum);
            if (blob) {
              createdUrl = URL.createObjectURL(blob);
              setImageUrl(createdUrl);
            } else if (stateAnalysis?.imgURL) {
              setImageUrl(stateAnalysis.imgURL);
            }

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

  // --- 5. INFERENCIA CON YOLOV8 ---
  useEffect(() => {
    if (imageLoaded && imgRef.current && !savedDetections) {
      processSource(imgRef.current);
    }
  }, [imageLoaded, processSource, savedDetections]);

  const activeDetections = useMemo(() => {
    return savedDetections || liveDetections || [];
  }, [savedDetections, liveDetections]);

  // --- 6. DIBUJAR BOUNDING BOXES SOBRE CANVAS ---
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

  // --- 7. AGREGACIÓN DE RESULTADOS ---
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

  // --- 8. PERSISTENCIA EN DEXIE.JS ---
  useEffect(() => {
    if (savedDetections || isLoading || !analysisId || isNaN(Number(analysisId))) return;

    const idNum = Number(analysisId);

    if (liveDetections && liveDetections.length > 0) {
      const topParasite = aggregatedData[0];

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
          isSynced: false,
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
          isSynced: false,
        })
        .catch((err) => {
          console.error('Error al actualizar resultado negativo en Dexie:', err);
        });
    }
  }, [isLoading, aggregatedData, liveDetections, savedDetections, analysisId, imageLoaded]);

  // --- 9. ACCIÓN DE VALIDACIÓN CLÍNICA (ACTIVE LEARNING) ---
  const handleDoctorValidation = async (
    actionType: 'CORRECT' | 'FALSE_POSITIVE' | 'RELABEL',
    updatedFields: Partial<Diagnosis>
  ) => {
    if (!analysisId || isNaN(Number(analysisId))) return;
    const idNum = Number(analysisId);

    setIsSubmittingValidation(true);
    try {
      await db.transaction('rw', [db.diagnoses, db.pendingSyncs], async () => {
        // 1. Actualizar el diagnóstico localmente
        await db.diagnoses.update(idNum, {
          ...updatedFields,
          isSynced: false,
        });

        // 2. Registrar la acción en la cola de sincronización
        await db.pendingSyncs.add({
          diagnosisId: idNum,
          action: actionType,
          payload: updatedFields,
          timestamp: new Date().toISOString(),
          retryCount: 0,
          status: 'PENDING',
        });
      });

      // Actualizar el estado visual del análisis en pantalla
      setAnalysis((prev) =>
        prev
          ? {
              ...prev,
              content: updatedFields.parasiteFound || prev.content,
            }
          : null
      );

      alert('Validación guardada en local. Se sincronizará automáticamente con el servidor.');
      setIsEditing(false);
    } catch (error) {
      console.error('Error guardando la validación médica:', error);
      alert('Ocurrió un error al guardar la validación.');
    } finally {
      setIsSubmittingValidation(false);
    }
  };

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
    <div className="relative flex size-full min-h-screen flex-col bg-white font-inter overflow-x-hidden print:bg-white print:text-black print:p-0">
      <div className="layout-container flex h-full grow flex-col">
        {/* ENCABEZADO EXCLUSIVO PARA IMPRESIÓN / PDF */}
        <div className="hidden print:block print:p-[0.5in] print:pb-4 print:mb-4 print:border-b-2 print:border-slate-800">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                ParasAIte - Informe Diagnóstico
              </h1>
              <p className="text-xs text-slate-600">Sistema Autónomo de Detección Parasitológica</p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p>
                <strong>Fecha de Emisión:</strong> {new Date().toLocaleDateString()}
              </p>
              <p>
                <strong>ID Paciente:</strong> {patientLocalId}
              </p>
            </div>
          </div>
        </div>

        <main className="gap-1 px-6 flex flex-1 justify-center py-5 print:p-[0.5in] print:py-0 print:w-[8.5in] print:max-w-none print:m-0">
          <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
            {/* CABECERA PANTALLA / BARRA DE ACCIONES (Oculta al imprimir) */}
            <header className="flex flex-wrap justify-between items-center gap-3 p-4 print:hidden">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="w-fit text-sm text-[#5e8d81] hover:underline"
                >
                  ← Volver
                </button>
                <h1 className="text-[#101816] tracking-light text-[32px] font-bold leading-tight">
                  Resultados del Análisis #{analysis.id}
                </h1>
              </div>

              <div className="mt-2 sm:mt-0">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Guardar Reporte (PDF)
                </button>
              </div>
            </header>

            {/* MUESTRA MICROSCÓPICA CON BOUNDING BOXES */}
            <section
              className="flex w-full grow bg-white p-4 justify-center items-center [page-break-inside:avoid] print:p-0 print:mb-6"
              ref={scannerContainerRef}
            >
              <div className="relative inline-block max-w-full bg-gray-50 rounded-lg border border-[#dae7e3] overflow-hidden print:border-slate-300">
                {imageUrl && (
                  <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Muestra microscópica"
                    className="max-h-[500px] w-auto block object-contain rounded-lg z-0 print:max-h-[400px]"
                    onLoad={() => setImageLoaded(true)}
                  />
                )}

                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                />

                <div className="absolute inset-0 pointer-events-none z-20 print:hidden">
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

              {/* OVERLAY DE CARGA (Oculto al imprimir) */}
              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/60 text-white backdrop-blur-sm flex-col z-30 transition-opacity duration-500 print:hidden ${
                  isLoading && !savedDetections ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <p className="text-lg font-medium">Analizando morfología con IA...</p>
                <div className="w-4/5 h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-[#00c795] animate-pulse w-full" />
                </div>
              </div>
            </section>

            {/* TABLA DE PARÁSITOS */}
            <section className="px-4 py-3 [page-break-inside:avoid] print:px-0">
              <h3 className="text-[#101816] text-lg font-bold leading-tight mb-4 print:text-slate-900">
                Parásitos Identificados
              </h3>
              <Table
                parasites={aggregatedData.length > 0 ? aggregatedData : analysis.detectedParasites}
              />
            </section>

            {/* FIRMA Y SELLO MÉDICO (Exclusivo para PDF / Impresión) */}
            <div className="hidden print:block print:pt-16 [page-break-inside:avoid]">
              <div className="flex justify-between items-end px-12">
                <div className="text-center w-64 border-t border-slate-800 pt-2">
                  <p className="text-xs font-semibold text-slate-800">Firma del Especialista</p>
                  <p className="text-[10px] text-slate-500">Parasitología / Microbiología</p>
                </div>
                <div className="text-center w-64 border-t border-slate-800 pt-2">
                  <p className="text-xs font-semibold text-slate-800">Sello Institucional</p>
                  <p className="text-[10px] text-slate-500">Validación de Laboratorio</p>
                </div>
              </div>
            </div>
          </div>

          {/* BARRA LATERAL GRÁFICOS Y VALIDACIÓN CLÍNICA (Oculta al imprimir) */}
          <aside className="layout-content-container flex flex-col w-[360px] hidden xl:flex print:hidden">
            <h3 className="text-[#101816] text-lg font-bold leading-tight px-4 pb-2 pt-4">
              Distribución de Confianza
            </h3>
            <div className="flex flex-wrap gap-4 px-4 py-3">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dae7e3] p-6 bg-[#fbfcfc]">
                <p className="text-[#101816] text-sm font-medium uppercase text-gray-500">
                  Promedio por Especie
                </p>
                <div className="h-[220px]">
                  <HorizontalBarChart
                    data={aggregatedData.length > 0 ? aggregatedData : analysis.detectedParasites}
                  />
                </div>
              </div>
            </div>

            {/* PANEL DE VALIDACIÓN CLÍNICA (ACTIVE LEARNING) */}
            <section className="p-4 bg-[#f0f5f4] m-4 rounded-xl border border-[#dae7e3] flex flex-col gap-3">
              <div>
                <h3 className="text-[#101816] text-base font-bold leading-tight mb-1">
                  Validación Experta (Active Learning)
                </h3>
                <p className="text-[#5e8d81] text-xs leading-normal">
                  Valida la precisión del diagnóstico o corrige la etiqueta para retroalimentar el
                  sistema.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  disabled={isSubmittingValidation}
                  onClick={() => handleDoctorValidation('CORRECT', { isSynced: false })}
                  className="w-full flex items-center justify-center rounded-lg h-9 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  ✔️ Confirmar Correcto
                </button>

                <button
                  disabled={isSubmittingValidation}
                  onClick={() =>
                    handleDoctorValidation('FALSE_POSITIVE', {
                      parasiteFound: 'Sin hallazgos parasitarios',
                      confidence: 1.0,
                      isSynced: false,
                    })
                  }
                  className="w-full flex items-center justify-center rounded-lg h-9 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  ❌ Falso Positivo
                </button>

                {!isEditing ? (
                  <button
                    disabled={isSubmittingValidation}
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center rounded-lg h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50"
                  >
                    ✏️ Corregir Etiqueta
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 p-2 bg-white rounded-lg border border-[#dae7e3]">
                    <select
                      value={selectedSpecies}
                      onChange={(e) => setSelectedSpecies(e.target.value)}
                      className="w-full text-xs p-2 border rounded bg-gray-50 focus:outline-none"
                    >
                      <option value="" disabled>
                        Seleccionar especie...
                      </option>
                      {parasiteTypes.map((specie) => (
                        <option key={specie} value={specie}>
                          {specie}
                        </option>
                      ))}
                      <option value="Sin hallazgos parasitarios">Sin hallazgos parasitarios</option>
                    </select>

                    <div className="flex gap-2">
                      <button
                        disabled={!selectedSpecies || isSubmittingValidation}
                        onClick={() =>
                          handleDoctorValidation('RELABEL', {
                            parasiteFound: selectedSpecies,
                            confidence: 1.0,
                            isSynced: false,
                          })
                        }
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs py-1.5 rounded-lg font-semibold transition-colors"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 bg-gray-200 text-gray-700 text-xs py-1.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#dae7e3]">
                <button
                  className="w-full text-xs text-[#5e8d81] hover:text-[#101816] font-medium underline text-center"
                  onClick={handleSendFeedback}
                >
                  ¿Error de segmentación? Enviar feedback detallado
                </button>
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default ScannerResults;
