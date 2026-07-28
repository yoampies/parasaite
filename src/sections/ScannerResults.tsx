// src/sections/ScannerResults.tsx
import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronLeft, ChevronRight, User, Save, Printer, ArrowLeft } from 'lucide-react';

// Componentes
import Table from '../components/Table';
import HorizontalBarChart from '../components/HorizontalBarChart';
import Error from '../components/Error';

// Constantes y Tipos
import {
  recentAnalyses as recentAnalysesConstant,
  recentImages,
  parasiteTypes,
} from '../assets/constants';
import { IAnalysis, IDetectedParasite, IBoundingBox } from '../types';
import useImageAnalysisWorker from '../hooks/UseImageAnalysisWorker';
import { useHistoryStore } from '../hooks/UseHistoryStore';
import { db, DetectionDetail, Diagnosis } from '../db/localDB';
import { CapturedFrameData } from './Scanner';

export function ScannerResults() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const loadFrameForDiagnosis = useHistoryStore((state) => state.loadFrameForDiagnosis);

  // --- 1. ESTADO GENERAL Y CARRUSEL DE FOTOGRAMAS ---
  const [analysis, setAnalysis] = useState<IAnalysis | null>(null);
  const [frameUrls, setFrameUrls] = useState<string[]>([]);
  const [frameDetections, setFrameDetections] = useState<IBoundingBox[][]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);

  const [savedDetections, setSavedDetections] = useState<IBoundingBox[] | null>(null);
  const [isHistoricalRecord, setIsHistoricalRecord] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [isFetchingLocal, setIsFetchingLocal] = useState<boolean>(true);

  // --- 2. PACIENTE Y VALIDACIÓN CLÍNICA ---
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const patients = useLiveQuery(() => db.patients.toArray(), []);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('');
  const [isSubmittingValidation, setIsSubmittingValidation] = useState<boolean>(false);

  // --- 3. REFS PARA CANVASES E IMAGEN ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  // --- 4. CARGA DE FOTOGRAMAS Y DATOS DESDE DEXIE / LOCATION ---
  useEffect(() => {
    let isMounted = true;
    const generatedUrls: string[] = [];

    const fetchAnalysisData = async () => {
      setIsFetchingLocal(true);

      const locationState = location.state as {
        capturedFrames?: CapturedFrameData[] | Blob[] | string[];
        primaryImageBlob?: Blob;
        analysis?: IAnalysis;
      };
      const passedFrames = locationState?.capturedFrames || [];

      // A) Carga desde Scanner en caliente
      if (passedFrames.length > 0) {
        const detectionsList: IBoundingBox[][] = [];

        passedFrames.forEach((frame) => {
          if (typeof frame === 'object' && 'blob' in frame) {
            const frameObj = frame as CapturedFrameData;
            generatedUrls.push(URL.createObjectURL(frameObj.blob));
            detectionsList.push(frameObj.detections || []);
          } else if (frame instanceof Blob) {
            generatedUrls.push(URL.createObjectURL(frame));
            detectionsList.push([]);
          } else if (typeof frame === 'string') {
            generatedUrls.push(frame);
            detectionsList.push([]);
          }
        });

        if (isMounted) {
          setFrameUrls(generatedUrls);
          setFrameDetections(detectionsList);
        }
      }

      // B) Carga desde IndexedDB (Navegación desde History)
      if (analysisId && !isNaN(Number(analysisId))) {
        const idNum = Number(analysisId);
        try {
          const diagRecord = await db.diagnoses.get(idNum);

          if (diagRecord && isMounted) {
            setIsHistoricalRecord(true); // Marca explícita de registro previo

            if (diagRecord.patientLocalId) {
              setSelectedPatientId(diagRecord.patientLocalId);
            }

            if (generatedUrls.length === 0) {
              const blob = await loadFrameForDiagnosis(idNum);
              if (blob) {
                const singleUrl = URL.createObjectURL(blob);
                generatedUrls.push(singleUrl);
              } else if (locationState?.analysis?.imgURL) {
                generatedUrls.push(locationState.analysis.imgURL);
              }
              setFrameUrls([...generatedUrls]);
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

            setAnalysis({
              id: diagRecord.id || idNum,
              date: diagRecord.date,
              content: diagRecord.parasiteFound || 'Análisis completado',
              imgURL: generatedUrls[0] || locationState?.analysis?.imgURL || '',
              detectedParasites: [],
              fileName: `muestra_${diagRecord.id || idNum}.jpg`,
            });

            setIsFetchingLocal(false);
            return;
          }
        } catch (error) {
          console.error('Error al leer diagnóstico desde Dexie:', error);
        }
      }

      // C) Fallback si viene el objeto analysis por la ruta (History)
      if (locationState?.analysis && isMounted) {
        setIsHistoricalRecord(true);
        setAnalysis(locationState.analysis);
        if (locationState.analysis.imgURL && generatedUrls.length === 0) {
          setFrameUrls([locationState.analysis.imgURL]);
        }
        setIsFetchingLocal(false);
        return;
      }

      // D) Fallback desde constantes locales
      const localData = localStorage.getItem('recentAnalyses');
      const localAnalyses: IAnalysis[] = localData ? JSON.parse(localData) : [];
      const allData = [...localAnalyses, ...recentAnalysesConstant, ...recentImages] as IAnalysis[];
      const foundAnalysis = allData.find((a) => a.id.toString() === analysisId);

      if (isMounted) {
        setIsHistoricalRecord(true);
        setAnalysis(foundAnalysis || null);
        if (foundAnalysis?.imgURL && generatedUrls.length === 0) {
          setFrameUrls([foundAnalysis.imgURL]);
        }
        setIsFetchingLocal(false);
      }
    };

    fetchAnalysisData();

    return () => {
      isMounted = false;
      generatedUrls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [analysisId, location.state, loadFrameForDiagnosis]);

  useEffect(() => {
    const firstPatientId = patients?.[0]?.id;

    if (firstPatientId !== undefined && !selectedPatientId) {
      setSelectedPatientId(firstPatientId.toString());
    }
  }, [patients, selectedPatientId]);

  // --- 5. WORKER DE INFERENCIA IA ---
  const { detectedParasites: liveDetections, isLoading, processSource } = useImageAnalysisWorker();

  const currentFrozenDetections = frameDetections[currentFrameIndex];

  // INHIBIR PREDICCIÓN: No procesar si es un registro histórico o ya posee detecciones guardadas
  useEffect(() => {
    const hasSaved = savedDetections && savedDetections.length > 0;
    const hasFrozen = currentFrozenDetections && currentFrozenDetections.length > 0;

    if (
      !isFetchingLocal &&
      !isHistoricalRecord &&
      imageLoaded &&
      imgRef.current &&
      !hasSaved &&
      !hasFrozen
    ) {
      processSource(imgRef.current);
    }
  }, [
    imageLoaded,
    currentFrameIndex,
    processSource,
    savedDetections,
    currentFrozenDetections,
    isFetchingLocal,
    isHistoricalRecord,
  ]);

  const activeDetections = useMemo(() => {
    if (savedDetections && savedDetections.length > 0) return savedDetections;
    if (currentFrozenDetections && currentFrozenDetections.length > 0)
      return currentFrozenDetections;
    return liveDetections || [];
  }, [savedDetections, currentFrozenDetections, liveDetections]);

  // --- 6. RENDERIZADO DE BOUNDING BOXES EN CANVAS ---
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
      const textWidth = ctx.measureText(label).width;
      const textHeight = 16;

      const labelX = x;
      const labelY = y > textHeight + 4 ? y - textHeight - 2 : y + h + 2;

      ctx.fillStyle = item.isGreyZone ? '#f59e0b' : '#00c795';
      ctx.fillRect(labelX, labelY, textWidth + 8, textHeight);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, labelX + 4, labelY + 12);
    });
  }, [activeDetections, imageLoaded, currentFrameIndex]);

  // AGREGACIÓN DE RESULTADOS
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

  // NAVEGACIÓN DEL CARRUSEL
  const handlePrevFrame = () => {
    setImageLoaded(false);
    setCurrentFrameIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextFrame = () => {
    setImageLoaded(false);
    setCurrentFrameIndex((prev) => Math.min(prev + 1, frameUrls.length - 1));
  };

  // VINCULACIÓN DE PACIENTE Y GUARDADO FINAL
  const handleSaveDiagnosisAndPatient = async () => {
    if (!selectedPatientId) {
      alert('Por favor selecciona o vincula un paciente antes de confirmar.');
      return;
    }

    if (!analysisId || isNaN(Number(analysisId))) {
      navigate('/history');
      return;
    }

    try {
      const idNum = Number(analysisId);
      await db.diagnoses.update(idNum, {
        patientLocalId: selectedPatientId,
        isSynced: false,
      });

      alert('Diagnóstico y paciente vinculados correctamente.');
      navigate('/history');
    } catch (error) {
      console.error('Error al guardar la vinculación:', error);
    }
  };

  // VALIDACIÓN MÉDICA
  const handleDoctorValidation = async (
    actionType: 'CORRECT' | 'FALSE_POSITIVE' | 'RELABEL',
    updatedFields: Partial<Diagnosis>
  ) => {
    if (!analysisId || isNaN(Number(analysisId))) return;
    const idNum = Number(analysisId);

    setIsSubmittingValidation(true);
    try {
      await db.transaction('rw', [db.diagnoses, db.pendingSyncs], async () => {
        await db.diagnoses.update(idNum, {
          ...updatedFields,
          patientLocalId: selectedPatientId || 'PAT-LOCAL-001',
          isSynced: false,
        });

        await db.pendingSyncs.add({
          diagnosisId: idNum,
          action: actionType,
          payload: { ...updatedFields, patientLocalId: selectedPatientId },
          timestamp: new Date().toISOString(),
          retryCount: 0,
          status: 'PENDING',
        });
      });

      setAnalysis((prev) =>
        prev ? { ...prev, content: updatedFields.parasiteFound || prev.content } : null
      );

      alert('Validación registrada en la base de datos local.');
      setIsEditing(false);
    } catch (error) {
      console.error('Error guardando la validación:', error);
    } finally {
      setIsSubmittingValidation(false);
    }
  };

  if (isFetchingLocal) {
    return (
      <div className="flex size-full min-h-screen items-center justify-center bg-white font-inter">
        <p className="text-sm font-medium text-[#5e8d81]">
          Recuperando fotogramas y datos de la muestra...
        </p>
      </div>
    );
  }

  if (!analysis && frameUrls.length === 0) {
    return (
      <Error
        title="Análisis no localizado"
        message="No se encontraron fotogramas o registros de esta muestra biológica."
        linkText="Volver al escáner"
        linkTo="/scanner"
      />
    );
  }

  const currentFrameUrl = frameUrls[currentFrameIndex] || analysis?.imgURL || '';
  const isAnalyzingWithModel =
    isLoading &&
    !isHistoricalRecord &&
    !savedDetections &&
    (!currentFrozenDetections || currentFrozenDetections.length === 0);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white font-inter overflow-x-hidden print:bg-white print:text-black print:p-0">
      <div className="layout-container flex h-full grow flex-col">
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
                <strong>Fecha:</strong> {new Date().toLocaleDateString()}
              </p>
              <p>
                <strong>Paciente ID:</strong> {selectedPatientId || 'Anónimo'}
              </p>
            </div>
          </div>
        </div>

        <main className="gap-1 px-6 flex flex-1 justify-center py-5 print:p-[0.5in] print:py-0 print:w-[8.5in] print:max-w-none print:m-0">
          <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
            <header className="flex flex-wrap justify-between items-center gap-3 p-4 print:hidden">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="w-fit text-sm text-[#5e8d81] hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Volver
                </button>
                <h1 className="text-[#101816] tracking-light text-[28px] font-bold leading-tight">
                  Resultados del Análisis {analysis?.id ? `#${analysis.id}` : ''}
                </h1>
              </div>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-[#00c795] hover:bg-[#00a67d] text-[#101816] rounded-xl text-sm font-bold transition-all shadow-sm"
              >
                <Printer className="w-4 h-4" /> Exportar Reporte PDF
              </button>
            </header>

            <section
              className="flex flex-col w-full bg-white p-4 justify-center items-center rounded-2xl border border-[#dae7e3] shadow-sm print:p-0 print:border-0"
              ref={scannerContainerRef}
            >
              <div className="relative inline-block max-w-full bg-slate-900 rounded-xl overflow-hidden border border-[#dae7e3] print:border-slate-300">
                {currentFrameUrl && (
                  <img
                    ref={imgRef}
                    src={currentFrameUrl}
                    alt={`Fotograma ${currentFrameIndex + 1}`}
                    className="max-h-[480px] w-auto block object-contain z-0 print:max-h-[400px]"
                    onLoad={() => setImageLoaded(true)}
                  />
                )}

                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                />

                <div
                  className={`absolute inset-0 flex items-center justify-center bg-black/60 text-white backdrop-blur-sm flex-col z-30 transition-opacity duration-300 print:hidden ${
                    isAnalyzingWithModel ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="text-sm font-medium">
                    Analizando fotograma {currentFrameIndex + 1} con YOLOv8...
                  </p>
                  <div className="w-1/2 h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-[#00c795] animate-pulse w-full" />
                  </div>
                </div>
              </div>

              {/* CONTROLES DEL CARRUSEL: Se muestran si existen más de un fotograma */}
              {frameUrls.length > 1 && (
                <div className="flex items-center justify-between w-full max-w-md mt-4 px-2 print:hidden">
                  <button
                    onClick={handlePrevFrame}
                    disabled={currentFrameIndex === 0}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f0f5f4] hover:bg-[#e0ece8] disabled:opacity-40 text-xs font-semibold text-[#101816]"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>

                  <span className="text-xs font-bold text-[#5e8d81]">
                    Fotograma {currentFrameIndex + 1} de {frameUrls.length}
                  </span>

                  <button
                    onClick={handleNextFrame}
                    disabled={currentFrameIndex === frameUrls.length - 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f0f5f4] hover:bg-[#e0ece8] disabled:opacity-40 text-xs font-semibold text-[#101816]"
                  >
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </section>

            <section className="bg-white p-5 rounded-2xl border border-[#dae7e3] shadow-sm mt-6 print:hidden">
              <div className="flex items-center gap-2 text-[#101816] font-bold text-base mb-3">
                <User className="w-5 h-5 text-[#00c795]" />
                <span>Vincular Registro con Paciente</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full sm:flex-1 p-2.5 bg-[#fbfcfc] border border-[#dae7e3] rounded-xl text-xs font-medium text-[#101816] focus:outline-none focus:ring-2 focus:ring-[#00c795]"
                >
                  <option value="" disabled>
                    -- Seleccionar Paciente --
                  </option>
                  {patients?.map((p) => (
                    <option key={p.id} value={p.localId || p.id}>
                      {p.name} (ID: {p.localId || p.id})
                    </option>
                  ))}
                  <option value="PAT-LOCAL-001">Paciente Anónimo / Consulta General</option>
                </select>

                <button
                  onClick={handleSaveDiagnosisAndPatient}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#00c795] text-[#101816] px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-[#00a67d] transition-all"
                >
                  <Save className="w-4 h-4" />
                  Confirmar y Guardar
                </button>
              </div>
            </section>

            <section className="py-4 print:px-0">
              <h3 className="text-[#101816] text-lg font-bold leading-tight mb-3">
                Parásitos Identificados
              </h3>
              <Table
                parasites={
                  aggregatedData.length > 0 ? aggregatedData : analysis?.detectedParasites || []
                }
              />
            </section>

            <div className="hidden print:block print:pt-16">
              <div className="flex justify-between items-end px-12">
                <div className="text-center w-64 border-t border-slate-800 pt-2">
                  <p className="text-xs font-semibold text-slate-800">Firma del Especialista</p>
                </div>
                <div className="text-center w-64 border-t border-slate-800 pt-2">
                  <p className="text-xs font-semibold text-slate-800">Sello Institucional</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="layout-content-container flex flex-col w-[360px] hidden xl:flex print:hidden">
            <h3 className="text-[#101816] text-base font-bold px-4 pt-2">
              Distribución por Confianza
            </h3>

            <div className="px-4 py-3">
              <div className="rounded-xl border border-[#dae7e3] p-4 bg-[#fbfcfc]">
                <p className="text-xs font-semibold uppercase text-gray-400 mb-2">
                  Promedio por Especie
                </p>
                <div className="h-[200px]">
                  <HorizontalBarChart
                    data={
                      aggregatedData.length > 0 ? aggregatedData : analysis?.detectedParasites || []
                    }
                  />
                </div>
              </div>
            </div>

            <section className="p-4 bg-[#f0f5f4] m-4 rounded-2xl border border-[#dae7e3] flex flex-col gap-3">
              <div>
                <h3 className="text-[#101816] text-sm font-bold mb-1">
                  Validación Experta (Active Learning)
                </h3>
                <p className="text-[#5e8d81] text-xs">
                  Confirma o corrige la inferencia para retroalimentar el dataset local.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  disabled={isSubmittingValidation}
                  onClick={() => handleDoctorValidation('CORRECT', { isSynced: false })}
                  className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all"
                >
                  ✔️ Confirmar Diagnóstico
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
                  className="w-full h-9 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all"
                >
                  ❌ Marcar Falso Positivo
                </button>

                {!isEditing ? (
                  <button
                    disabled={isSubmittingValidation}
                    onClick={() => setIsEditing(true)}
                    className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    ✏️ Corregir Especie
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
                        className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded-lg font-semibold"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 bg-gray-200 text-gray-700 text-xs py-1.5 rounded-lg font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default ScannerResults;
