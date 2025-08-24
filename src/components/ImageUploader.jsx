import React, { useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * @description Componente de carga de imágenes con funcionalidad de arrastrar y soltar.
 * Permite al usuario seleccionar un archivo de imagen, ya sea haciendo clic en un botón
 * o arrastrándolo y soltándolo en el área designada.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.instruction - El texto de instrucción para el usuario.
 * @param {string} props.message - Un mensaje de apoyo que describe el tipo de archivo esperado.
 * @param {string} props.typesOfFiles - Una cadena que especifica los tipos de archivos aceptados (ej. ".png, .jpg").
 * @param {string} props.selectedFileName - El nombre del archivo seleccionado para mostrar al usuario.
 * @param {function} props.onFileSelect - La función de callback que se ejecuta al seleccionar un archivo.
 */
function ImageUploader({ instruction, message, typesOfFiles, selectedFileName, onFileSelect }) {
  const fileInputRef = useRef(null);

  /**
   * @description Maneja el evento de cambio del input de archivo.
   * @param {Event} event - El evento del cambio de archivo.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  /**
   * @description Previene el comportamiento por defecto para permitir el drop.
   * @param {Event} event - El evento de arrastre.
   */
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  /**
   * @description Maneja el evento de soltar un archivo en el área de carga.
   * @param {Event} event - El evento de soltar.
   */
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  /**
   * @description Activa el input de archivo oculto al hacer clic en el botón.
   */
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col p-4">
      <div 
        className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#dae7e3] px-6 py-14"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex max-w-[480px] flex-col items-center gap-2">
          <p className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">{instruction}</p>
          <p className="text-[#101816] text-sm font-normal leading-normal max-w-[480px] text-center">
            {selectedFileName ? (
              <span className="truncate block">
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

// **Validación de Propiedades con PropTypes**
ImageUploader.propTypes = {
  instruction: PropTypes.string.isRequired,
  message: PropTypes.string,
  typesOfFiles: PropTypes.string,
  selectedFileName: PropTypes.string,
  onFileSelect: PropTypes.func.isRequired,
};

// **Propiedades por Defecto**
ImageUploader.defaultProps = {
  message: "Arrastra y suelta una imagen, o haz clic en el botón.",
  typesOfFiles: "Tipos de archivo aceptados: .jpg, .png",
  selectedFileName: null,
};

export default ImageUploader;