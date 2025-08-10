import React from 'react'

function ScannerCard({imgURL}) {
  return (
    <div className="flex flex-col gap-3">
        <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg" style={{ backgroundImage: `url("${imgURL}")` }}></div>
    </div>
  )
}

export default ScannerCard