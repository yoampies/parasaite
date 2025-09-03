import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { months } from '../assets/constants';

// --- Funciones de Ayuda ---
// Mover estas funciones fuera del componente evita que se vuelvan a crear en cada renderizado

/**
 * @description Obtiene el número de días en un mes específico.
 * @param {number} year - El año.
 * @param {number} month - El mes (0-11).
 * @returns {number} El número de días.
 */
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * @description Calcula el día de la semana de inicio de un mes.
 * @param {number} year - El año.
 * @param {number} month - El mes (0-11).
 * @returns {number} El día de la semana de inicio (1=Lunes, 7=Domingo).
 */
const getStartingDay = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 7 : day;
};

// --- Componente principal ---

/**
 * @description Componente de filtro de calendario para seleccionar un rango de fechas.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - El título del calendario.
 * @param {function} props.onDateChange - Callback que se ejecuta con el rango de fechas seleccionado.
 */
function CalendarFilter({ title, onDateChange }) {
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });

  const currentMonth = activeDate.getMonth();
  const currentYear = activeDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startingDay = getStartingDay(currentYear, currentMonth);

  // Memoiza la generación del array de días para optimizar el rendimiento.
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  // --- Lógica de Manejo de Eventos y Estado ---

  /**
   * @description Maneja el clic en un día para establecer un rango de fechas.
   * @param {number} day - El día del mes clickeado.
   */
  const handleDayClick = (day) => {
    const dayDate = new Date(currentYear, currentMonth, day);
    dayDate.setHours(0, 0, 0, 0);

    const { start, end } = selectedRange;

    // Lógica para alternar la selección de rango.
    if (!start || (start && end)) {
      setSelectedRange({ start: dayDate, end: null });
    } else if (dayDate.getTime() < start.getTime()) {
      setSelectedRange({ start: dayDate, end: start });
    } else {
      setSelectedRange({ ...selectedRange, end: dayDate });
    }
  };

  /**
   * @description Cambia el mes visualizado en el calendario.
   * @param {number} direction - -1 para mes anterior, 1 para mes siguiente.
   */
  const handleMonthChange = (direction) => {
    const newDate = new Date(activeDate);
    newDate.setMonth(activeDate.getMonth() + direction);
    setActiveDate(newDate);
  };

  // Se activa el callback cuando el rango de fechas está completo.
  useEffect(() => {
    if (selectedRange.start && selectedRange.end) {
      if (typeof onDateChange === 'function') {
        onDateChange(selectedRange);
      }
    }
  }, [selectedRange, onDateChange]);

  // --- Lógica de Estilos Condicionales ---

  /**
   * @description Genera las clases CSS para un día específico basándose en el estado de selección.
   * @param {number} day - El día del mes.
   * @returns {string} Una cadena de clases CSS de Tailwind.
   */
  const getDayClassNames = (day) => {
    const dayDate = new Date(currentYear, currentMonth, day);
    dayDate.setHours(0, 0, 0, 0);

    const { start, end } = selectedRange;
    const hasCompleteRange = start && end;

    // ** Corrección del error: ** Se comprueba si el rango está completo antes de intentar ordenar.
    const sortedRange = hasCompleteRange ? [start, end].sort((a, b) => a.getTime() - b.getTime()) : [];

    const isStart = start && dayDate.getTime() === start.getTime();
    const isEnd = end && dayDate.getTime() === end.getTime();
    const isInRange = hasCompleteRange && dayDate > sortedRange[0] && dayDate < sortedRange[1];

    const baseClasses = 'h-12 w-full text-[#101816] text-sm font-medium leading-normal';
    const bgClasses = isInRange || isStart || isEnd ? 'bg-[#f0f5f4]' : '';
    const roundedClasses = isStart ? 'rounded-l-full' : (isEnd ? 'rounded-r-full' : '');
    const circleClasses = isStart || isEnd ? 'bg-[#00c795] text-white' : '';

    return `${baseClasses} ${bgClasses} ${roundedClasses} ${circleClasses}`;
  };

  return (
    <>
      <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        {title}
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-6 p-4">
        <div className="flex min-w-72 max-w-[336px] flex-1 flex-col gap-0.5">
          <div className="flex items-center p-1 justify-between">
            <button onClick={() => handleMonthChange(-1)}>
              <div className="text-[#101816] flex size-10 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                </svg>
              </div>
            </button>
            <p className="text-[#101816] text-base font-bold leading-tight flex-1 text-center">
              {`${months[currentMonth]} ${currentYear}`}
            </p>
            <button onClick={() => handleMonthChange(1)}>
              <div className="text-[#101816] flex size-10 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                </svg>
              </div>
            </button>
          </div>
          <div className="grid grid-cols-7">
            {Array(startingDay - 1).fill(null).map((_, index) => (
              <div key={`empty-${index}`} className="h-12 w-full" />
            ))}
            {days.map((day) => (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={getDayClassNames(day)}
              >
                <div className={`flex size-full items-center justify-center rounded-full 
                  ${(selectedRange.start && new Date(currentYear, currentMonth, day).setHours(0,0,0,0) === selectedRange.start.getTime() || selectedRange.end && new Date(currentYear, currentMonth, day).setHours(0,0,0,0) === selectedRange.end.getTime()) ? 'bg-[#00c795] text-white' : ''}`}>
                  {day}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Validación de Propiedades
CalendarFilter.propTypes = {
  title: PropTypes.string.isRequired,
  onDateChange: PropTypes.func,
};

// Propiedades por defecto para mayor robustez
CalendarFilter.defaultProps = {
  onDateChange: () => {},
};

export default CalendarFilter;