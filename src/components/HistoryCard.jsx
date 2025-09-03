import React from "react";
import PropTypes from "prop-types";

/**
 * @description Componente de tarjeta de registro en la sección de historial
 * Muestra un título, contenido, una imagen y es clickeable. Es un componente
 * de presentación puramente funcional y reutilizable.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - El título principal de la tarjeta.
 * @param {string} props.content - Una descripción o texto breve.
 * @param {string} props.imgURL - La URL de la imagen a mostrar.
 * @param {function} props.onClick - Función de callback para el evento de clic.
 */
function HistoryCard({ title, content, imgURL, onClick }) {
  return (
    <div onClick={onClick} className="p-4 block cursor-pointer">
      <div className="flex items-stretch justify-between gap-4 rounded-lg bg-white p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:scale-[1.02]">
        
        <div className="flex flex-col gap-1 flex-[2_2_0px]">
          <p className="text-[#101816] text-base leading-tight font-bold">{title}</p>
          <p className="text-[#5e8d81] text-sm font-normal leading-normal">{content}</p>
        </div>
        
        <div 
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1" 
          style={{ backgroundImage: `url("${imgURL}")` }}
        ></div>
        
      </div>
    </div>
  );
}

// **Validación de Propiedades con PropTypes**
HistoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  imgURL: PropTypes.string,
  onClick: PropTypes.func,
};

// **Propiedades por Defecto**
HistoryCard.defaultProps = {
  content: "No hay contenido disponible.",
  imgURL: "https://via.placeholder.com/300", // Imagen de marcador de posición
  onClick: () => {}, // Función vacía para evitar errores
};

export default HistoryCard;