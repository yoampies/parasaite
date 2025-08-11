import {useState} from 'react'
import { weekDays } from '../assets/constants';

function CalendarFilter({title, startingDate, endingDate}) {
    const daysInMonth = 30;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const [selectedDays, setSelectedDays] = useState([startingDate, endingDate]);
    
    const sortedSelectedDays = [...selectedDays].sort((a, b) => a - b);
    const minDay = sortedSelectedDays[0];
    const maxDay = sortedSelectedDays[1];

    const isInRange = (day) => {
        return day >= minDay && day <= maxDay;
    };

    const isRoundedGreen = (day) => selectedDays.includes(day);

    const getColStartClass = (day) => (day === 1 ? "col-start-4" : "");

    const getRoundedClass = (day) => {
        if (day === minDay) return "rounded-l-full";
        if (day === maxDay) return "rounded-r-full";
        return "";
    };

    const handleDayClick = (day) => {
        if (selectedDays.length >= 2) {
        setSelectedDays([day]);
        } else {
        setSelectedDays([...selectedDays, day]);
        }
    };

  return (
    <>
        <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">{title}</h3>
        <div className="flex flex-wrap items-center justify-center gap-6 p-4">
            <div className="flex min-w-72 max-w-[336px] flex-1 flex-col gap-0.5">
            <div className="flex items-center p-1 justify-between">
                <button>
                <div
                    className="text-[#101816] flex size-10 items-center justify-center"
                    data-icon="CaretLeft"
                    data-size="18px"
                    data-weight="regular"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                    </svg>
                </div>
                </button>
                <p className="text-[#101816] text-base font-bold leading-tight flex-1 text-center">Enero 2024</p>
                <button>
                <div
                    className="text-[#101816] flex size-10 items-center justify-center"
                    data-icon="CaretRight"
                    data-size="18px"
                    data-weight="regular"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                    </svg>
                </div>
                </button>
            </div>
            <div className="grid grid-cols-7">
                {weekDays.map((weekDay) => (
                <p
                    key={weekDay.id}
                    className="text-[#101816] text-[13px] font-bold leading-normal tracking-[0.015em] flex h-12 w-full items-center justify-center pb-0.5"
                >
                    {weekDay.name}
                </p>
                ))}
                {days.map((day) => (
                <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`h-12 w-full text-[#101816] text-sm font-medium leading-normal 
                    ${getColStartClass(day)} ${getRoundedClass(day)} ${isInRange(day) ? "bg-[#f0f5f4]" : ""}`}
                >
                    <div
                    className={`flex size-full items-center justify-center rounded-full ${
                        isRoundedGreen(day) ? "bg-[#00c795]" : ""
                    }`}
                    >
                    {day}
                    </div>
                </button>
                ))}
            </div>
            </div>
        </div>
    </>
  )
}

export default CalendarFilter