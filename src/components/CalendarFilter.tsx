import { useState, useMemo, useEffect } from 'react';
import { months } from '../assets/constants';
import { DateRange, CalendarFilterProps } from '../types';

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getStartingDay = (year: number, month: number): number => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 7 : day;
};

function CalendarFilter({ title, onDateChange }: CalendarFilterProps) {
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>( {
    start: null,
    end: null,
  });

  const currentMonth = activeDate.getMonth();
  const currentYear = activeDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startingDay = getStartingDay(currentYear, currentMonth);

  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const handleDayClick = (day: number) => {
    const dayDate = new Date(currentYear, currentMonth, day);
    dayDate.setHours(0, 0, 0, 0);

    const { start, end } = selectedRange;

    if (!start || (start && end)) {
      setSelectedRange({ start: dayDate, end: null });
    } else if (dayDate.getTime() < start.getTime()) {
      setSelectedRange({ start: dayDate, end: start });
    } else {
      setSelectedRange({ ...selectedRange, end: dayDate });
    }
  };

  const handleMonthChange = (direction: number) => {
    const newDate = new Date(activeDate);
    newDate.setMonth(activeDate.getMonth() + direction);
    setActiveDate(newDate);
  };

  useEffect(() => {
    if (selectedRange.start && selectedRange.end) {
      if (typeof onDateChange === 'function') {
        onDateChange(selectedRange);
      }
    }
  }, [selectedRange, onDateChange]);

  const getDayClassNames = (day: number): string => {
    const dayDate = new Date(currentYear, currentMonth, day);
    dayDate.setHours(0, 0, 0, 0);

    const { start, end } = selectedRange;
    const hasCompleteRange = start !== null && end !== null;

    const sortedRange = hasCompleteRange 
      ? [start, end].sort((a, b) => a.getTime() - b.getTime()) 
      : [];

    const isStart = start !== null && dayDate.getTime() === start.getTime();
    const isEnd = end !== null && dayDate.getTime() === end.getTime();
    const isInRange = hasCompleteRange && dayDate > sortedRange[0] && dayDate < sortedRange[1];

    const baseClasses = 'h-12 w-full text-[#101816] text-sm font-medium leading-normal';
    const bgClasses = isInRange || isStart || isEnd ? 'bg-[#f0f5f4]' : '';
    const roundedClasses = isStart ? 'rounded-l-full' : (isEnd ? 'rounded-r-full' : '');

    return `${baseClasses} ${bgClasses} ${roundedClasses}`;
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
            {days.map((day) => {
              const dayTime = new Date(currentYear, currentMonth, day).setHours(0, 0, 0, 0);
              const isSelected = (selectedRange.start?.getTime() === dayTime) || (selectedRange.end?.getTime() === dayTime);
              
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={getDayClassNames(day)}
                >
                  <div className={`flex size-full items-center justify-center rounded-full ${isSelected ? 'bg-[#00c795] text-white' : ''}`}>
                    {day}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default CalendarFilter;