import React, { useRef } from 'react';

function ImageUploader({ instruction, message, typesOfFiles, selectedFileName, onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Comunica el nombre del archivo seleccionado al componente padre
      onFileSelect(file.name); 
      console.log('Archivo seleccionado:', file);
    }
  };

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#dae7e3] px-6 py-14">
        <div className="flex max-w-[480px] flex-col items-center gap-2">
          <p className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">{instruction}</p>
          <p className="text-[#101816] text-sm font-normal leading-normal max-w-[480px] text-center">
            {selectedFileName ? selectedFileName : `${message} ${typesOfFiles}`}
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          onClick={handleButtonClick}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f5f4] text-[#101816] text-sm font-bold leading-normal tracking-[0.015em]"
        >
          <span className="truncate">Subir</span>
        </button>
      </div>
    </div>
  );
}

export default ImageUploader;