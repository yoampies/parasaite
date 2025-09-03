import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Navbar from "./Navbar";

/**
 * @description Componente de página de error genérica y reutilizable. Muestra un título, un mensaje
 * y un enlace personalizable para la navegación, manteniendo la consistencia del layout
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - Título del error.
 * @param {string} props.message - Descripción detallada del error.
 * @param {string} props.linkText - Texto del enlace de navegación.
 * @param {string} props.linkTo - La ruta a la que apunta el enlace.
 */
function Error({ title, message, linkText, linkTo }) {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden font-inter">
      <Navbar />
      <div className="flex flex-1 justify-center py-5 px-40">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <h2 className="text-red-500 text-[22px] font-bold leading-tight tracking-[-0.015em] p-4">
            {title}
          </h2>
          <p className="text-[#5e8d81] text-base font-normal leading-normal px-4">
            {message}
          </p>
          <p className="text-[#5e8d81] text-base font-normal leading-normal px-4 py-2">
            <Link to={linkTo} className="text-[#101816] font-bold underline">
              {linkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Validación de propiedades con PropTypes
// Esto asegura que el componente reciba los datos correctos.
Error.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  linkText: PropTypes.string,
  linkTo: PropTypes.string,
};

// Se establecen valores por defecto para hacer el componente más flexible
// y evitar errores si las props no se pasan.
Error.defaultProps = {
  title: "Error",
  message: "Ha ocurrido un error inesperado.",
  linkText: "Volver al inicio",
  linkTo: "/",
};

export default Error;