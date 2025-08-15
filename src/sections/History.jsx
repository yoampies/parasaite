// History.jsx

//Components
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Search from "../components/Search";
import SelectionFilter from "../components/SelectionFilter";
import ConfidenceLvlFilter from "../components/ConfidenceLvlFilter";
import CalendarFilter from "../components/CalendarFilter";
import ButtonFilter from "../components/ButtonFilter";
//Constants
import { recentAnalyses, parasiteTypes } from "../assets/constants";
//Tools
import 'rc-slider/assets/index.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function History() {
  const [currentFilter, setCurrentFilter] = useState(null);
  const [displayedAnalyses, setDisplayedAnalyses] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    // 1. Cargar los análisis guardados en localStorage
    const storedAnalyses = JSON.parse(localStorage.getItem('recentAnalyses')) || [];

    // 2. Filtrar los análisis de ejemplo de la constante, eliminando los que ya están en el localStorage
    const filteredConstantAnalyses = recentAnalyses.filter(
      (constantAnalysis) => 
        !storedAnalyses.some((storedAnalysis) => storedAnalysis.id === constantAnalysis.id)
    );

    // 🟢 CAMBIO AQUÍ: Combinar ambos arrays, colocando primero los de la constante
    const combinedAnalyses = [...filteredConstantAnalyses, ...storedAnalyses];
    
    setDisplayedAnalyses(combinedAnalyses);
  }, []);

  const handleFilterSelection = (selectedOption) => {
    setCurrentFilter(selectedOption);
    console.log("Opción seleccionada:", selectedOption);
  };
  
  const handleCardClick = (analysisId) => {
      navigate(`/scanner-results/${analysisId}`);
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{
        "--checkbox-tick-svg": `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='rgb(16,24,22)' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`,
        fontFamily: 'Inter, "Noto Sans", sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <Search placeholder="Buscar por fecha, hora o tipo de parásito"/>
            <SelectionFilter title="Filtrar por Parásito" options={parasiteTypes} />      
            <ConfidenceLvlFilter title="Filtrar por Nivel de Confianza"/>
            <CalendarFilter title="Filtrar por Fecha" startingDate={7} endingDate={20}/>
            <ButtonFilter title="Filtrar por Estado de Retroalimentación" onSelect={handleFilterSelection}/>
          </div>
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
            {displayedAnalyses.map((analysis) => (
              <Card 
                key={analysis.id} 
                title={`Análisis del ${analysis.date}`} 
                content={analysis.content} 
                imgURL={analysis.imgURL}
                onClick={() => handleCardClick(analysis.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;