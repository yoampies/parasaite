import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * @description Componente de tarjeta reutilizable diseñado para mostrar información de parásitos
 * con un enlace dinámico a sus detalles. Muestra un título, un breve contenido de texto y una imagen
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - El título del parásito. Se usa para generar la URL.
 * @param {string} props.content - Una breve descripción del parásito.
 * @param {string} props.imgURL - La URL de la imagen del parásito.
 */
function RegularCard({ title, content, imgURL }) {
  // Genera la ruta dinámica a partir del título, normalizando el texto.
  const parasitePath = `/library/${title.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <Link to={parasitePath} className="p-4 block">
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
    </Link>
  );
}

// **Validación de Propiedades con PropTypes**
RegularCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  imgURL: PropTypes.string,
};

// **Propiedades por Defecto**
RegularCard.defaultProps = {
  content: "No hay contenido disponible para este parásito.",
  imgURL: "https://via.placeholder.com/300", // Imagen de marcador de posición
};

export default RegularCard;