import { useState, useEffect } from 'react';
import { SelectionFilterProps } from '../types';

// 1. Definimos la constante fuera del componente
const DEFAULT_SELECTED: string[] = [];

/**
 * @description Componente de filtro basado en checkboxes.
 * Utiliza un Set interno para garantizar búsquedas y manipulaciones de O(1).
 */
function SelectionFilter({ 
  title, 
  options, 
  initialSelected = DEFAULT_SELECTED, // 2. Usamos la referencia estable
  onSelectionChange 
}: SelectionFilterProps) {
  
  // Especificamos que el Set contendrá strings: Set<string>
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set(initialSelected));

  // Sincronización si los valores iniciales cambian desde un nivel superior
  useEffect(() => {
    setSelectedOptions(new Set(initialSelected));
  }, [initialSelected]);

  /**
   * @description Maneja la selección/deselección de opciones.
   * Crea una nueva instancia de Set para disparar el re-renderizado de React.
   */
  const handleCheckboxChange = (option: string) => {
    const newSelectedOptions = new Set(selectedOptions);

    if (newSelectedOptions.has(option)) {
      newSelectedOptions.delete(option);
    } else {
      newSelectedOptions.add(option);
    }

    setSelectedOptions(newSelectedOptions);

    // Emitimos el cambio como un array para facilitar el manejo en el componente padre
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelectedOptions));
    }
  };

  return (
    <>
      <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        {title}
      </h3>
      <div className="px-4">
        {options.map((op) => (
          <label 
            key={op} 
            className="flex gap-x-3 py-3 flex-row items-center cursor-pointer group"
          >
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-[#dae7e3] border-2 bg-transparent text-[#00c795] checked:bg-[#00c795] checked:border-[#00c795] focus:ring-0 focus:ring-offset-0 focus:border-[#dae7e3] focus:outline-none cursor-pointer transition-colors"
              checked={selectedOptions.has(op)}
              onChange={() => handleCheckboxChange(op)}
            />
            <p className="text-[#101816] text-base font-normal leading-normal group-hover:text-[#5e8d81] transition-colors">
              {op}
            </p>
          </label>
        ))}
      </div>
    </>
  );
}

export default SelectionFilter;