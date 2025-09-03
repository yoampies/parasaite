import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Componentes
import Navbar from '../components/Navbar';
import Error from '../components/Error';

// Constantes
import { recentAnalyses } from '../assets/constants';

const FEEDBACK_OPTIONS = [
  { id: 'incorrect_id', label: 'Identificación Incorrecta' },
  { id: 'false_detection', label: 'Falsa Detección' },
  { id: 'incomplete_detection', label: 'Detección Incompleta' },
  { id: 'other', label: 'Otro' },
];

/**
 * @description Componente para enviar feedback sobre un análisis de parásitos
 * Permite al usuario seleccionar un tipo de error y escribir una descripción detallada.
 */
const ScannerFeedback = () => {
  const [selectedFeedback, setSelectedFeedback] = useState(FEEDBACK_OPTIONS[0].id);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const navigate = useNavigate();
  const { analysisId } = useParams();

  const analysis = useMemo(() => {
    const storedAnalyses = JSON.parse(localStorage.getItem('recentAnalyses') || '[]');
    return storedAnalyses.find(a => a.id.toString() === analysisId) || recentAnalyses.find(a => a.id.toString() === analysisId);
  }, [analysisId]);

  if (!analysis) {
    return (
      <Error
        title="Error: Análisis no encontrado"
        message="Lo sentimos, no pudimos encontrar los detalles para este análisis."
        linkText="Volver al escáner"
        linkTo="/scanner"
      />
    );
  }

  const radioDotSvg = `url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(16,24,22)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3ccircle cx=%278%27 cy=%278%27 r=%273%27/%3e%3c/svg%3e')`;

  /**
   * @description Maneja el envío del formulario de feedback.
   * @param {object} e - El evento del formulario.
   */
  const handleFeedbackSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto de recargar la página

    console.log("Feedback enviado:", {
      analysisId: analysis.id,
      feedbackType: selectedFeedback,
      message: feedbackMessage,
    });
    
    // Aquí podrías enviar los datos a una API
    alert('¡Gracias por tu feedback!');
    navigate('/history');
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-inter"
      style={{
        '--radio-dot-svg': radioDotSvg,
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1">
            <h2 className="text-[#101816] tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">
              {`Enviar Feedback del Análisis ${analysis.date}`}
            </h2>
            <p className="text-[#101816] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Gracias por ayudarnos a mejorar. Por favor, describe el error que encontraste.
            </p>
            
            {/* El formulario para el feedback */}
            <form onSubmit={handleFeedbackSubmit}>
              <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                Tipo de Error
              </h3>
              <div className="flex flex-col gap-3 p-4">
                {FEEDBACK_OPTIONS.map((option) => (
                  <label key={option.id} className="flex items-center gap-4 rounded-lg border border-solid border-[#dae7e3] p-[15px] has-[input:checked]:border-[#101816]">
                    <input
                      type="radio"
                      className="h-5 w-5 border-2 border-[#dae7e3] bg-transparent text-transparent checked:border-[#101816] checked:bg-[image:var(--radio-dot-svg)] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#101816]"
                      name="feedback-type"
                      value={option.id}
                      checked={selectedFeedback === option.id}
                      onChange={() => setSelectedFeedback(option.id)}
                    />
                    <div className="flex grow flex-col">
                      <p className="text-[#101816] text-sm font-medium leading-normal">{option.label}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <textarea
                    placeholder="Describe el error en detalle"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101816] focus:outline-0 focus:ring-0 border border-[#dae7e3] bg-white focus:border-[#dae7e3] min-h-36 placeholder:text-[#5e8d81] p-[15px] text-base font-normal leading-normal"
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                  ></textarea>
                </label>
              </div>
              <div className="flex px-4 py-3 justify-end">
                <button
                  type="submit" // Cambiado a 'submit' para funcionar con el formulario
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#00c795] text-[#101816] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Enviar Feedback</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

ScannerFeedback.propTypes = {};

export default ScannerFeedback;