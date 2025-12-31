import { useRef, ChangeEvent, DragEvent } from 'react';
import { ImageUploaderProps } from '../types';

/**
 * @description Componente de carga de imágenes con funcionalidad de arrastrar y soltar.
 * Implementa un área de "drop zone" y un input de archivo nativo oculto para mayor accesibilidad.
 */
function ImageUploader({ 
  instruction, 
  message = "Arrastra y suelta una imagen, o haz clic en el botón.", 
  typesOfFiles = "Tipos de archivo aceptados: .jpg, .png", 
  selectedFileName = null, 
  onFileSelect 
}: ImageUploaderProps) {
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * @description Maneja el evento de cambio del input de archivo.
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  /**
   * @description Previene el comportamiento por defecto para habilitar la zona de soltado.
   */
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  /**
   * @description Procesa el archivo soltado en el área designada.
   */
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col p-4">
      <div 
        className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#dae7e3] px-6 py-14 transition-colors hover:border-[#00c795]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex max-w-[480px] flex-col items-center gap-2">
          <p className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] text-center">
            {instruction}
          </p>
          <p className="text-[#101816] text-sm font-normal leading-normal text-center">
            {selectedFileName ? (
              <span className="truncate block font-medium text-[#00c795]">
                {selectedFileName}
              </span>
            ) : (
              `${message} ${typesOfFiles}`
            )}
          </p>
        </div>
        
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        
        <button
          type="button"
          onClick={handleButtonClick}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f5f4] text-[#101816] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#dae7e3] transition-colors"
        >
          Subir
        </button>
      </div>
    </div>
  );
}

export default ImageUploader;