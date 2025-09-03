import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Asume que este archivo de constantes existe y exporta un array de strings
// Por ejemplo: `export const feedbackStatus = ['Abierto', 'Cerrado', 'Pendiente'];`
import { feedbackStatus } from '../assets/constants';

/**
 * @description Componente de filtro de botones tipo "radio" para selección de una sola opción.
 * Es un componente de presentación que gestiona su propio estado de selección
 * y comunica la opción elegida a un componente padre a través de un callback.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - El título del grupo de botones.
 * @param {string[]} [props.options=feedbackStatus] - Un array de strings para las opciones.
 * @param {function} props.onSelect - Función callback que se ejecuta al seleccionar un botón.
 */
function ButtonFilter({ title, options = feedbackStatus, onSelect }) {
  const [selectedOption, setSelectedOption] = useState(null);

  /**
   * @description Maneja el cambio de la opción seleccionada.
   * Actualiza el estado local y notifica al componente padre.
   * @param {string} option - La opción seleccionada.
   */
  const handleOptionChange = (option) => {
    setSelectedOption(option);
    // Llama al callback `onSelect` solo si fue proporcionado.
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div>
      <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3 p-4">
        {options.map((option) => (
          <label
            key={option}
            htmlFor={`option-${option}`}
            className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-[#dae7e3] px-4 h-11 text-[#101816] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#00c795] relative cursor-pointer"
          >
            <p>{option}</p>
            <input
              id={`option-${option}`}
              type="radio"
              className="invisible absolute"
              name="filter"
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

// **Validación de Propiedades con PropTypes**
// Esto asegura que el componente reciba las propiedades en el formato esperado,
// lo que facilita la depuración y mejora la reusabilidad.
ButtonFilter.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func.isRequired,
};

// **Configuración de Propiedades por Defecto**
// Proporciona un valor predeterminado para `options` si no se pasa ninguna.
ButtonFilter.defaultProps = {
  options: feedbackStatus,
};

export default ButtonFilter;