import React, { useState, useMemo } from 'react';
import { months } from '../assets/constants';

function CalendarFilter({ title, onDateChange }) {
  const today = new Date();
  const [activeDate, setActiveDate] = useState(today);
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartingDay = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 7 : day;
  };

  const currentMonth = activeDate.getMonth();
  const currentYear = activeDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startingDay = getStartingDay(currentYear, currentMonth);
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const handleDayClick = (day) => {
    const dayDate = new Date(currentYear, currentMonth, day);

    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: dayDate, end: null });
    } else if (dayDate.getTime() < selectedRange.start.getTime()) {
      setSelectedRange({ start: dayDate, end: selectedRange.start });
    } else {
      setSelectedRange({ ...selectedRange, end: dayDate });
    }
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(activeDate);
    newDate.setMonth(activeDate.getMonth() + direction);
    setActiveDate(newDate);
  };

  const handleOnDateChange = (range) => {
    if (onDateChange) {
      onDateChange(range);
    }
  };

  React.useEffect(() => {
    if (selectedRange.start && selectedRange.end) {
      handleOnDateChange(selectedRange);
    }
  }, [selectedRange]);

  const isBetweenRange = (dayDate) => {
    if (!selectedRange.start || !selectedRange.end) {
      return false;
    }
    const sortedRange = [selectedRange.start, selectedRange.end].sort((a, b) => a.getTime() - b.getTime());
    return dayDate > sortedRange[0] && dayDate < sortedRange[1];
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
              const dayDate = new Date(currentYear, currentMonth, day);
              const isStart = selectedRange.start && dayDate.getTime() === selectedRange.start.getTime();
              const isEnd = selectedRange.end && dayDate.getTime() === selectedRange.end.getTime();
              const isInRange = isBetweenRange(dayDate);

              const hasGrayBackground = selectedRange.start && selectedRange.end && (isStart || isEnd || isInRange);

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`h-12 w-full text-[#101816] text-sm font-medium leading-normal 
                    ${hasGrayBackground ? 'bg-[#f0f5f4]' : ''} 
                    ${isStart ? 'rounded-l-full' : ''} 
                    ${isEnd ? 'rounded-r-full' : ''}`}
                >
                  <div className={`flex size-full items-center justify-center rounded-full ${isStart || isEnd ? 'bg-[#00c795]' : ''}`}>
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