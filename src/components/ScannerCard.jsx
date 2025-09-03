import React from 'react';
import PropTypes from 'prop-types';

/**
 * @description Componente de tarjeta para la sección del escáner. Muestra una imagen y
 * maneja un estado de selección visual para indicar si ha sido clickeada
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.imgURL - La URL de la imagen a mostrar en la tarjeta.
 * @param {function} props.onClick - Función de callback que se ejecuta al hacer clic en la tarjeta.
 * @param {boolean} props.isSelected - Estado que indica si la tarjeta está seleccionada.
 */
function ScannerCard({ imgURL, onClick, isSelected }) {
  // Las clases de CSS se definen de forma dinámica para aplicar estilos condicionales.
  const cardClasses = `flex flex-col gap-3 cursor-pointer rounded-lg ${
    isSelected ? 'ring-2 ring-offset-2 ring-[#00c795]' : ''
  }`;

  return (
    <div className={cardClasses} onClick={onClick}>
      <div
        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
        style={{ backgroundImage: `url("${imgURL}")` }}
      ></div>
    </div>
  );
}

// **Validación de Propiedades con PropTypes**
ScannerCard.propTypes = {
  imgURL: PropTypes.string,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
};

// **Propiedades por Defecto**
// Se establecen valores predeterminados para asegurar que el componente no falle
// si las props no se proporcionan.
ScannerCard.defaultProps = {
  imgURL: "https://via.placeholder.com/200", // Marcador de posición visual
  onClick: () => {}, // Función vacía para prevenir errores de tipo
  isSelected: false,
};

export default ScannerCard;