import React from 'react'

function ScannerCard({ imgURL, onClick, isSelected }) {
    const cardClasses = `flex flex-col gap-3 cursor-pointer ${isSelected ? 'ring-2 ring-offset-2 ring-[#00c795] rounded-lg' : ''}`;

    return (
        <div className={cardClasses} onClick={onClick}>
            <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                style={{ backgroundImage: `url("${imgURL}")` }}
            ></div>
        </div>
    )
}

export default ScannerCard