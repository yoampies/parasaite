import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import HomeCard from './HomeCard';
import ScannerCard from './ScannerCard';
import RegularCard from './RegularCard';
import HistoryCard from './HistoryCard';

/**
 * @description Componente principal `Card` que renderiza una tarjeta específica
 * según la ruta actual de la aplicación.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - Título de la tarjeta.
 * @param {string} props.content - Contenido o descripción de la tarjeta.
 * @param {string} props.imgURL - URL de la imagen de la tarjeta.
 * @param {React.ReactNode} props.children - Elementos hijos para la tarjeta.
 * @param {function} props.onClick - Callback para eventos de clic.
 * @param {boolean} props.isSelected - Estado de selección de la tarjeta.
 */
function Card({ title, content, imgURL, children, onClick, isSelected }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Usa un objeto para mapear rutas a componentes, evitando el uso de `if/else if`
  // y mejorando la escalabilidad del código.
  const componentsByPath = {
    '/': <HomeCard title={title}>{children}</HomeCard>,
    '/scanner': <ScannerCard imgURL={imgURL} onClick={onClick} isSelected={isSelected} />,
    '/history': <HistoryCard title={title} content={content} imgURL={imgURL} onClick={onClick} />,
  };

  // Se obtiene el componente correspondiente a la ruta actual.
  // Si la ruta no coincide, se usa `RegularCard` como valor por defecto.
  const CurrentCard = componentsByPath[currentPath] || (
    <RegularCard title={title} content={content} imgURL={imgURL} />
  );

  return CurrentCard;
}

// Validación de propiedades con PropTypes para un uso más seguro y predecible.
Card.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  imgURL: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
};

// Se establecen valores por defecto para evitar errores si las props no se pasan.
Card.defaultProps = {
  title: '',
  content: '',
  imgURL: '',
  children: null,
  onClick: () => {},
  isSelected: false,
};

export default Card;