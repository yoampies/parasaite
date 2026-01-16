import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * @description Componente de barra de navegación principal.
 * Proporciona acceso global a las secciones de Inicio, Escáner, Historial y Biblioteca.
 * Ahora incluye diseño responsive (Mobile-First).
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="relative flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f5f4] px-6 md:px-10 py-3 bg-white z-50">
      {/* Sección del logo y título */}
      <div className="flex items-center gap-4 text-[#101816]">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <h2 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">
          Parasite-Vision AI
        </h2>
        {/* Versión corta del título para móviles muy pequeños */}
        <h2 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] sm:hidden">
          PV-AI
        </h2>
      </div>

      {/* Sección Derecha: Navegación (Desktop) + Acciones */}
      <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
        {/* Navegación Desktop (Oculta en móvil) */}
        <nav className="hidden md:flex items-center gap-9">
          <Link
            className="text-[#101816] text-sm font-medium leading-normal hover:text-[#5e8d81] transition-colors"
            to="/"
          >
            Inicio
          </Link>
          <Link
            className="text-[#101816] text-sm font-medium leading-normal hover:text-[#5e8d81] transition-colors"
            to="/scanner"
          >
            Escáner
          </Link>
          <Link
            className="text-[#101816] text-sm font-medium leading-normal hover:text-[#5e8d81] transition-colors"
            to="/history"
          >
            Historial
          </Link>
          <Link
            className="text-[#101816] text-sm font-medium leading-normal hover:text-[#5e8d81] transition-colors"
            to="/library"
          >
            Parásitos
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Botón de Ayuda (Visible siempre) */}
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f0f5f4] text-[#101816] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#dae7e3] transition-colors"
            aria-label="Ayuda"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
            </svg>
          </button>

          {/* Avatar (Visible siempre) */}
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-[#dae7e3]"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/a/default-user")' }}
            role="img"
            aria-label="Foto de perfil del usuario"
          ></div>

          {/* Botón Menú Hamburguesa (Visible solo en móvil) */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center p-2 rounded-lg text-[#101816] hover:bg-[#f0f5f4] transition-colors"
            onClick={toggleMenu}
            aria-label="Menú"
          >
            {isMenuOpen ? (
              // Icono X (Cerrar)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
              </svg>
            ) : (
              // Icono Hamburguesa (Abrir)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm176,112H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-[#f0f5f4] shadow-lg md:hidden flex flex-col py-4 px-6 gap-4 z-40">
          <Link
            onClick={toggleMenu}
            className="text-[#101816] text-base font-medium py-2 hover:text-[#5e8d81]"
            to="/"
          >
            Inicio
          </Link>
          <Link
            onClick={toggleMenu}
            className="text-[#101816] text-base font-medium py-2 hover:text-[#5e8d81]"
            to="/scanner"
          >
            Escáner
          </Link>
          <Link
            onClick={toggleMenu}
            className="text-[#101816] text-base font-medium py-2 hover:text-[#5e8d81]"
            to="/history"
          >
            Historial
          </Link>
          <Link
            onClick={toggleMenu}
            className="text-[#101816] text-base font-medium py-2 hover:text-[#5e8d81]"
            to="/library"
          >
            Parásitos
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
