import React from 'react'

function ImageUploader({instruction, message, typesOfFiles}) {
  return (
    <div className="flex flex-col p-4">
        <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#dae7e3] px-6 py-14">
        <div className="flex max-w-[480px] flex-col items-center gap-2">
            <p className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">{instruction}</p>
            <p className="text-[#101816] text-sm font-normal leading-normal max-w-[480px] text-center">{message} {typesOfFiles}</p>
        </div>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f5f4] text-[#101816] text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Subir</span>
        </button>
        </div>
    </div>
  )
}

export default ImageUploader