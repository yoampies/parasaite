import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

/**
 * @description Componente de filtro con slider de rango. Permite a los usuarios seleccionar
 * un rango de confianza y notifica al componente padre sobre los cambios.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - El título del filtro.
 * @param {function} props.onRangeChange - Función callback que se ejecuta cuando el rango cambia.
 * @param {number[]} props.initialRange - Array con los valores iniciales [min, max] del rango del slider.
 */
function ConfidenceLvlFilter({ title, onRangeChange, initialRange }) {
  // CORRECTED: Ensure state is always initialized with a valid array.
  // We use a functional update to avoid re-creating the array on every render.
  const [confidenceRange, setConfidenceRange] = useState(initialRange || [0, 100]);

  /**
   * @description Maneja el cambio de valor del slider, actualizando el estado local.
   * @param {number[]} newRange - El nuevo rango de valores [min, max].
   */
  const handleSliderChange = (newRange) => {
    setConfidenceRange(newRange);
  };

  // Sincroniza los cambios del slider con la prop `initialRange` si esta cambia.
  useEffect(() => {
    if (initialRange) {
      setConfidenceRange(initialRange);
    }
  }, [initialRange]);

  // Llama al callback `onRangeChange` cada vez que el estado del rango cambia.
  useEffect(() => {
    if (typeof onRangeChange === 'function') {
      onRangeChange(confidenceRange);
    }
  }, [confidenceRange, onRangeChange]);

  return (
    <>
      <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">{title}</h3>
      <div className="@container">
        <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row">
          <div className="flex h-[38px] w-full pt-1.5 px-4">
            <Slider
              range
              min={0}
              max={100}
              value={confidenceRange}
              onChange={handleSliderChange}
              trackStyle={[{ backgroundColor: '#101816' }]}
              handleStyle={[
                { backgroundColor: '#101816', borderColor: '#101816', opacity: 1, boxShadow: 'none' },
                { backgroundColor: '#101816', borderColor: '#101816', opacity: 1, boxShadow: 'none' }
              ]}
            />
          </div>
        </div>
        <div className="flex justify-between px-4">
          <p className="text-[#101816] text-sm font-normal leading-normal">{confidenceRange[0]}</p>
          <p className="text-[#101816] text-sm font-normal leading-normal">{confidenceRange[1]}</p>
        </div>
      </div>
    </>
  );
}

// Validación de propiedades con PropTypes.
ConfidenceLvlFilter.propTypes = {
  title: PropTypes.string.isRequired,
  onRangeChange: PropTypes.func,
  initialRange: PropTypes.arrayOf(PropTypes.number),
};

// Se establecen valores por defecto para un uso más flexible y seguro.
ConfidenceLvlFilter.defaultProps = {
  onRangeChange: () => {},
  initialRange: [0, 100],
};

export default ConfidenceLvlFilter;