import { useState, useMemo, useRef, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import ExpandedModelCard from '../components/ExpandedModelCard';

// Componentes
import Navbar from '../components/Navbar';
import Error from '../components/Error';
import SectionRendering from '../components/SectionRendering';

// Constantes y Tipos
import { parasites, parasiteData } from '../assets/constants';
import { IParasite, IParasiteDetail, IParasiteTabs } from '../types';

/**
 * @description Página de detalles del parásito.
 * Orquesta la visualización de datos médicos y la renderización de modelos 3D
 * mediante un sistema de pestañas (Tabs).
 */
const ParasiteDetails = () => {
  // 1. Tipado de parámetros de URL
  const { parasiteName } = useParams<{ parasiteName: string }>();

  // 2. Estado con tipos literales para las pestañas
  const [activeTab, setActiveTab] = useState<keyof IParasiteTabs>('overview');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [expandedModelPath, setExpandedModelPath] = useState<string | null>(null);

  // 3. Referencia para persistir el scroll al cerrar el modelo 3D
  const scrollPositionRef = useRef<number>(0);

  // 4. Búsqueda memorizada del parásito básico
  const parasite = useMemo<IParasite | undefined>(
    () => parasites.find((p) => p.name.toLowerCase().replace(/\s/g, '-') === parasiteName),
    [parasiteName]
  );

  // 5. Obtención de datos detallados (Morfología, Ciclo de vida, etc.)
  const currentParasiteData = useMemo<IParasiteDetail | undefined>(() => {
    return parasiteName ? (parasiteData as Record<string, IParasiteDetail>)[parasiteName] : undefined;
  }, [parasiteName]);

  // 6. Efecto para restaurar la posición del scroll tras cerrar el visor 3D
  useEffect(() => {
    if (!isExpanded && scrollPositionRef.current !== null) {        
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    }
  }, [isExpanded]);

  // Manejo de errores de ruta
  if (!parasite || !currentParasiteData || !parasiteName) {
    return (
      <Error
        title="Error: Parásito no encontrado"
        message="Lo sentimos, no pudimos encontrar los detalles clínicos para esta especie."
        linkText="Volver a la biblioteca"
        linkTo="/library"
      />
    );
  }

  const { name } = parasite;
  const { subtitle, tabs } = currentParasiteData;
  const sections = tabs[activeTab]?.sections || [];

  // Nombres de visualización para la UI
  const TAB_DISPLAY_NAMES: Record<keyof IParasiteTabs, string> = {
    overview: 'Generalidades',
    morphology: 'Morfología',
    lifeCycle: 'Ciclo de Vida',
  };

  // Rotación específica según la especie para optimizar la vista inicial
  const parasiteRotation: [number, number, number] = 
    ['ascaris-lumbricoides', 'enterobius-vermicularis', 'trichuris-trichiura'].includes(parasiteName) 
    ? [-2.5, -2, 0] 
    : [0, 0, 0];

  return (
    <Fragment>
      {/* Vista Expandida (Modal 3D Fullscreen) */}
      {isExpanded && expandedModelPath && (
        <ExpandedModelCard 
          isExpanded={isExpanded} 
          setIsExpanded={setIsExpanded} 
          modelPath={expandedModelPath}
          rotation={parasiteRotation}
        />
      )}

      {/* Vista Principal de la Página */}
      {!isExpanded && (
        <div className="relative flex size-full min-h-screen flex-col bg-white font-inter">
          <div className="layout-container flex h-full grow flex-col">
            <Navbar />
            <main className="px-10 lg:px-40 flex flex-1 justify-center py-5">
              <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                
                {/* Breadcrumb */}
                <nav className="flex flex-wrap gap-2 p-4 text-base font-medium">
                  <Link to="/library" className="text-[#5e8d81] hover:underline">
                    Biblioteca de Parásitos
                  </Link>
                  <span className="text-[#5e8d81]">/</span>
                  <span className="text-[#101816]">{name}</span>
                </nav>
                
                {/* Encabezado */}
                <header className="flex flex-wrap justify-between gap-3 p-4">
                  <div className="flex min-w-72 flex-col gap-3">
                    <h1 className="text-[#101816] tracking-light text-[32px] font-bold leading-tight">
                      {name}
                    </h1>
                    <p className="text-[#5e8d81] text-base font-normal leading-normal">
                      {subtitle}
                    </p>
                  </div>
                </header>
                
                {/* Sistema de Pestañas */}
                <div className="pb-3">
                  <div className="flex border-b border-[#dae7e3] px-4 gap-8">
                    {(Object.keys(tabs) as Array<keyof IParasiteTabs>).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-all ${
                          activeTab === tab 
                            ? 'border-b-[#101816] text-[#101816]' 
                            : 'border-b-transparent text-[#5e8d81] hover:text-[#101816]'
                        }`}
                      >
                        <span className="text-sm font-bold leading-normal tracking-[0.015em]">
                          {TAB_DISPLAY_NAMES[tab]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Motor de Renderizado de Secciones */}
                <SectionRendering 
                  sections={sections} 
                  parasiteName={parasiteName}
                  scrollPositionRef={scrollPositionRef}
                  isExpanded={isExpanded} 
                  setIsExpanded={setIsExpanded}
                  setExpandedModelPath={setExpandedModelPath}
                  parasiteRotation={parasiteRotation}
                />
              </div>
            </main>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ParasiteDetails;