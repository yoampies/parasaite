import React from 'react';
import PropTypes from 'prop-types';

/**
 * @description Componente contenedor estilizado para la página de inicio.
 * Muestra un título y renderiza cualquier contenido pasado como 'children'.
 * Es un componente de presentación sin lógica de estado interna.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - El título que se muestra en la parte superior.
 * @param {React.ReactNode} props.children - Los elementos hijos a renderizar.
 */
function HomeCard({ title, children }) {
  return (
    <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dae7e3] p-6 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
      <p className="text-[#101816] text-base leading-normal font-medium">{title}</p>
      {children}
    </div>
  );
}

// Validación de propiedades con PropTypes
HomeCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

// Se establecen valores por defecto para hacer el componente más flexible
HomeCard.defaultProps = {
  title: 'Título no proporcionado',
  children: null,
};

export default HomeCard;