import { useState, ChangeEvent } from 'react';
import { SearchProps } from '../types'

/**
 * @description Componente de entrada de búsqueda con ícono.
 * Implementa un input controlado que notifica cambios en tiempo real.
 */
function Search({ 
  placeholder = "Buscar...", 
  onSearch = () => {} 
}: SearchProps) {
  const [searchValue, setSearchValue] = useState<string>("");

  /**
   * @description Maneja el cambio de valor del input y notifica al padre.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <div className="px-4 py-3">
      <label className="flex flex-col min-w-40 h-12 w-full">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
          {/* Contenedor del ícono */}
          <div
            className="text-[#5e8d81] flex border-none bg-[#f0f5f4] items-center justify-center pl-4 rounded-l-lg border-r-0"
            aria-hidden="true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </div>
          
          {/* Input de búsqueda */}
          <input
            type="text"
            placeholder={placeholder}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101816] focus:outline-0 focus:ring-0 border-none bg-[#f0f5f4] focus:border-none h-full placeholder:text-[#5e8d81] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            value={searchValue}
            onChange={handleInputChange}
            aria-label={placeholder}
          />
        </div>
      </label>
    </div>
  );
}

export default Search;