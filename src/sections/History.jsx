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

function History() {
    
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
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2">
                <p className="text-[#101816] text-base font-medium leading-normal">Distribución de Análisis</p>
                <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight truncate">120</p>
                <div className="flex gap-1">
                  <p className="text-[#5e8d81] text-base font-normal leading-normal">Últimos 30 Días</p>
                  <p className="text-[#07882e] text-base font-medium leading-normal">+15%</p>
                </div>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: "60%" }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Ene 1</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: "100%" }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Ene 8</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: "50%" }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Ene 15</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: "40%" }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Ene 22</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: "70%" }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Ene 29</p>
                </div>
              </div>
            </div>
            <SelectionFilter title="Filtrar por Parásito" options={parasiteTypes} />            
            <ConfidenceLvlFilter title="Filtrar por Nivel de Confianza"/>
            <CalendarFilter title="Filtrar por Fecha" startingDate={7} endingDate={20}/>
            <ButtonFilter title="Filtrar por Estado de Retroalimentación" />
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
            {recentAnalyses.map((analysis) => (
              <Card key={analysis.id} title={`Análisis del ${analysis.date}`} content={analysis.content} imgURL={analysis.imgURL} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;