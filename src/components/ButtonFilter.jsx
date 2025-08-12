import { useState } from 'react';
import { feedbackStatus } from '../assets/constants';

// Se puede mover a otro archivo de constantes o definirlo aquí si solo se usa en este componente.

function ButtonFilter({ title, options = feedbackStatus, onSelect }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
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
            htmlFor={`option-${option}`} // Conecta la etiqueta con el input
            className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-[#dae7e3] px-4 h-11 text-[#101816] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#00c795] relative cursor-pointer"
          >
            <p>{option}</p>
            <input 
              id={`option-${option}`} // ID único para accesibilidad
              type="radio" 
              className="invisible absolute" 
              name="filter" // El nombre es común para agrupar los radio buttons
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export default ButtonFilter;