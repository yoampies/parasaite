import Slider from "rc-slider"
import { useState } from "react";

function ConfidenceLvlFilter({title}) {
    const [confidenceRange, setConfidenceRange] = useState([0, 100]);
    const handleSliderChange = (newRange) => {
        setConfidenceRange(newRange);
    };

  return (
    <>
        <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">{title}</h3>
        <div className="@container">
            <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row">
            <div className="flex h-[38px] w-full pt-1.5 px-4">
                <Slider
                range
                min={0}
                max={100}
                value={confidenceRange}
                onChange={handleSliderChange}
                trackStyle={[{ backgroundColor: '#101816' }]}
                handleStyle={[
                    { backgroundColor: '#101816', borderColor: '#101816', opacity: 1, boxShadow: 'none' },
                    { backgroundColor: '#101816', borderColor: '#101816', opacity: 1, boxShadow: 'none' }
                ]}
                />
            </div>
            </div>
            <div className="flex justify-between px-4">
            <p className="text-[#101816] text-sm font-normal leading-normal">{confidenceRange[0]}</p>
            <p className="text-[#101816] text-sm font-normal leading-normal">{confidenceRange[1]}</p>
            </div>
        </div>
    </>
  )
}

export default ConfidenceLvlFilter