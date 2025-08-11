import React from 'react'

function SelectionFilter({title, options}) {
  return (
    <>
        <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">{title}</h3>
        <div className="px-4">
            {options.map((op) => (
            <label key={op} className="flex gap-x-3 py-3 flex-row">
                <input
                type="checkbox"
                className="h-5 w-5 rounded border-[#dae7e3] border-2 bg-transparent text-[#00c795] checked:bg-[#00c795] checked:border-[#00c795] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#dae7e3] focus:outline-none"
                />
                <p className="text-[#101816] text-base font-normal leading-normal">{op}</p>
            </label>
            ))}
        </div>
    </>
  )
}

export default SelectionFilter