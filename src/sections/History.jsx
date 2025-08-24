import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

// Components
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Search from "../components/Search";
import SelectionFilter from "../components/SelectionFilter";
import ConfidenceLvlFilter from "../components/ConfidenceLvlFilter";
import CalendarFilter from "../components/CalendarFilter";
import ButtonFilter from "../components/ButtonFilter";

// Constants & Data
import { recentAnalyses, parasiteTypes } from "../assets/constants";
import 'rc-slider/assets/index.css';

/**
 * @description Array of filter components and their props for dynamic rendering.
 * This simplifies the JSX and makes the component more scalable.
 */
const filters = [
  { component: SelectionFilter, title: "Filtrar por Parásito", options: parasiteTypes },
  { component: ConfidenceLvlFilter, title: "Filtrar por Nivel de Confianza" },
  { component: CalendarFilter, title: "Filtrar por Fecha", startingDate: 7, endingDate: 20 },
  { component: ButtonFilter, title: "Filtrar por Estado de Retroalimentación" },
];

/**
 * @description Página que muestra un historial de análisis. Permite al usuario
 * buscar, filtrar y ver detalles de análisis previos.
 */
function History() {
  const [displayedAnalyses, setDisplayedAnalyses] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load recent analyses from localStorage and combine with initial data.
    const storedAnalyses = JSON.parse(localStorage.getItem('recentAnalyses')) || [];
    
    // Filter out duplicates and combine the lists. The `useMemo` below handles the final sorting.
    const uniqueAnalyses = [...recentAnalyses, ...storedAnalyses].reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      }
      return acc;
    }, []);

    setDisplayedAnalyses(uniqueAnalyses);
  }, []);

  // Sort analyses by date for consistent display.
  const sortedAnalyses = useMemo(() => {
    return [...displayedAnalyses].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [displayedAnalyses]);

  /**
   * @description Handles the click event on an analysis card.
   * @param {object} analysis - The analysis object to navigate to.
   */
  const handleCardClick = (analysis) => {
    navigate(`/scanner-results/${analysis.id}`, { state: { analysis } });
  };
  
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{
        // Using a custom property for the SVG tick is an interesting approach,
        // but it's often better to define this in a global CSS file or a dedicated utility class.
        "--checkbox-tick-svg": `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='rgb(16,24,22)' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`,
        fontFamily: 'Inter, "Noto Sans", sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Side Filter Section */}
          <div className="layout-content-container flex flex-col w-80">
            <Search placeholder="Buscar por fecha, hora o tipo de parásito"/>
            {filters.map((filter, index) => (
              <filter.component 
                key={index} 
                title={filter.title} 
                {...filter} // Pass all other props dynamically
              />
            ))}
          </div>
          {/* Main Content Section */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight">Revisar Análisis Anteriores</p>
                <p className="text-[#5e8d81] text-sm font-normal leading-normal">
                  Accede y gestiona tus análisis anteriores. Haz clic en cualquier entrada para ver los resultados detallados, incluyendo imágenes anotadas e información sobre el parásito.
                </p>
              </div>
            </div>
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Análisis Recientes</h2>
            {sortedAnalyses.map((analysis) => (
              <Card 
                key={analysis.id} 
                title={`Análisis del ${analysis.date}`} 
                content={analysis.content} 
                imgURL={analysis.imgURL}
                onClick={() => handleCardClick(analysis)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

History.propTypes = {};

export default History;