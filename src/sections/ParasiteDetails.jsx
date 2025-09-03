import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Componentes
import Navbar from '../components/Navbar';
import Error from '../components/Error';
import SectionRendering from '../components/SectionRendering';

// Constantes
import { parasites, parasiteData } from '../assets/constants';

/**
 * @description Componente de la página de detalles de un parásito
 * Muestra información detallada sobre un parásito específico, incluyendo
 * diferentes secciones como generalidades, morfología y ciclo de vida.
 */
const ParasiteDetails = () => {
  // Obtiene el nombre del parásito de la URL usando el hook `useParams` de React Router.
  const { parasiteName } = useParams();
  // Usa el estado para controlar qué pestaña está activa, con 'overview' como valor inicial.
  const [activeTab, setActiveTab] = useState('overview');

  // Con `useMemo`, se busca el parásito en los datos solo cuando `parasiteName` cambia.
  const parasite = useMemo(
    () => parasites.find((p) => p.name.toLowerCase().replace(/\s/g, '-') === parasiteName),
    [parasiteName]
  );

  // De igual manera, se obtienen los datos detallados del parásito de forma memorizada.
  const currentParasiteData = useMemo(() => parasiteData[parasiteName], [parasiteName]);

  // Maneja el caso en que la URL no coincida con un parásito existente.
  if (!parasite || !currentParasiteData) {
    return (
      <Error
        title="Error: Parásito no encontrado"
        message="Lo sentimos, no pudimos encontrar los detalles para este parásito."
        linkText="Volver a la librería de parásitos"
        linkTo="/library"
      />
    );
  }

  // Desestructura las propiedades del objeto `parasite` y `currentParasiteData` para un código más limpio.
  const { name } = parasite;
  const { subtitle, tabs } = currentParasiteData;
  const sections = tabs[activeTab]?.sections || [];

  /**
   * Mapeo de las claves de las pestañas a sus nombres de visualización en español.
   * La clave `'life-cycle'` debe coincidir con la clave en el archivo de datos.
   * El nombre de la variable se ha estandarizado para mayor claridad.
   */
  const TAB_DISPLAY_NAMES = {
    overview: 'Generalidades',
    morphology: 'Morfología',
    lifeCycle: 'Ciclo de Vida',
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Navegación tipo "Breadcrumb" para la ruta del usuario */}
            <div className="flex flex-wrap gap-2 p-4">
              <Link to="/library" className="text-[#5e8d81] text-base font-medium leading-normal hover:underline">
                Librería de Parásitos
              </Link>
              <span className="text-[#5e8d81] text-base font-medium leading-normal">/</span>
              <span className="text-[#101816] text-base font-medium leading-normal">{name}</span>
            </div>
            
            {/* Encabezado de la página */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight">{name}</p>
                <p className="text-[#5e8d81] text-sm font-normal leading-normal">{subtitle}</p>
              </div>
            </div>
            
            {/* Navegación por pestañas (tabs) */}
            <div className="pb-3">
              <div className="flex border-b border-[#dae7e3] px-4 gap-8">
                {/* Mapea las claves de las pestañas para crear botones dinámicamente */}
                {Object.keys(tabs).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                      activeTab === tab ? 'border-b-[#101816] text-[#101816]' : 'border-b-transparent text-[#5e8d81]'
                    }`}
                  >
                    <p className="text-sm font-bold leading-normal tracking-[0.015em] capitalize">
                      {TAB_DISPLAY_NAMES[tab]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Contenido de la sección, renderizado dinámicamente según la pestaña activa */}
            <SectionRendering sections={sections} parasiteName={parasiteName} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Se incluye la validación de props como buena práctica.
ParasiteDetails.propTypes = {};

export default ParasiteDetails;