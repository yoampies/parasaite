import { useState } from 'react';
import { feedbackStatus } from '../assets/constants';
import { ButtonFilterProps } from '../types';

function ButtonFilter({ title, options = feedbackStatus, onSelect }: ButtonFilterProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (option: string) => {
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

export default ButtonFilter;