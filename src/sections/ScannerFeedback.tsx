import { useState, useMemo, ChangeEvent, FormEvent, CSSProperties } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Componentes
import Navbar from '../components/Navbar';
import Error from '../components/Error';

// Constantes y Tipos
import { recentAnalyses } from '../assets/constants';
import { IAnalysis, FeedbackOption } from '../types';

const FEEDBACK_OPTIONS: FeedbackOption[] = [
  { id: 'incorrect_id', label: 'Identificación Incorrecta' },
  { id: 'false_detection', label: 'Falsa Detección' },
  { id: 'incomplete_detection', label: 'Detección Incompleta' },
  { id: 'other', label: 'Otro' },
];

/**
 * @description Componente para el reporte de errores en la detección de parásitos.
 * Permite capturar feedback cualitativo para el re-entrenamiento del modelo.
 */
const ScannerFeedback = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();

  const [selectedFeedback, setSelectedFeedback] = useState<string>(FEEDBACK_OPTIONS[0].id);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // 1. Búsqueda memorizada y segura del análisis
  const analysis = useMemo<IAnalysis | undefined>(() => {
    if (!analysisId) return undefined;

    const stored = localStorage.getItem('recentAnalyses');
    const storedAnalyses: IAnalysis[] = stored ? JSON.parse(stored) : [];

    return (
      storedAnalyses.find((a) => a.id.toString() === analysisId) ||
      recentAnalyses.find((a) => a.id.toString() === analysisId)
    );
  }, [analysisId]);

  // Early return para errores de ID
  if (!analysis) {
    return (
      <Error
        title="Error: Análisis no encontrado"
        message="No pudimos localizar el registro solicitado para el envío de feedback."
        linkText="Volver al escáner"
        linkTo="/scanner"
      />
    );
  }

  const radioDotSvg = `url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(16,24,22)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3ccircle cx=%278%27 cy=%278%27 r=%273%27/%3e%3c/svg%3e')`;

  /**
   * @description Maneja el envío del formulario con tipado de evento de React.
   */
  const handleFeedbackSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Log estructurado para integración futura con API
    console.log('Feedback clínico enviado:', {
      analysisId: analysis.id,
      timestamp: new Date().toISOString(),
      feedbackType: selectedFeedback,
      message: feedbackMessage,
    });

    alert('¡Gracias! Tu feedback ayuda a mejorar la precisión diagnóstica.');
    navigate('/history');
  };

  // Tipado de variables CSS personalizadas
  const dynamicStyles: CSSProperties = {
    // @ts-expect-error: Justificación breve (ej: librería externa sin tipos)
    '--radio-dot-svg': radioDotSvg,
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden font-inter"
      style={dynamicStyles}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <main className="px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1">
            <header>
              <h2 className="text-[#101816] tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">
                Feedback del Análisis: {analysis.date}
              </h2>
              <p className="text-[#5e8d81] text-base font-normal leading-normal pb-3 pt-1 px-4">
                Tus observaciones permiten que la red neuronal aprenda de casos atípicos o errores
                de clasificación morfológica.
              </p>
            </header>

            <form onSubmit={handleFeedbackSubmit} className="mt-4">
              <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                Categoría del Error
              </h3>

              <div className="flex flex-col gap-3 p-4">
                {FEEDBACK_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-4 rounded-lg border border-solid border-[#dae7e3] p-[15px] cursor-pointer hover:bg-[#f0f5f4] transition-colors has-[input:checked]:border-[#101816] has-[input:checked]:bg-[#f0f5f4]"
                  >
                    <input
                      type="radio"
                      className="h-5 w-5 border-2 border-[#dae7e3] bg-transparent text-transparent checked:border-[#101816] checked:bg-[image:var(--radio-dot-svg)] focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      name="feedback-type"
                      value={option.id}
                      checked={selectedFeedback === option.id}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSelectedFeedback(e.target.value)
                      }
                    />
                    <div className="flex grow flex-col">
                      <p className="text-[#101816] text-sm font-medium leading-normal">
                        {option.label}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex flex-col gap-4 px-4 py-3">
                <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em]">
                  Descripción Detallada
                </h3>
                <textarea
                  placeholder="Ej: El parásito identificado como Ascaris lumbricoides presenta características más compatibles con Strongyloides stercoralis..."
                  className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#101816] focus:outline-0 focus:ring-2 focus:ring-[#00c795] border border-[#dae7e3] bg-white min-h-36 placeholder:text-[#5e8d81]/60 p-[15px] text-base font-normal leading-normal transition-shadow"
                  value={feedbackMessage}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setFeedbackMessage(e.target.value)
                  }
                  required
                />
              </div>

              <div className="flex px-4 py-3 justify-end">
                <button
                  type="submit"
                  className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#00c795] text-[#101816] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#00a67d] transition-all active:scale-95"
                >
                  Enviar Feedback
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScannerFeedback;
