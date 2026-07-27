import { useMemo, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../hooks/UseHistoryStore';
import { Diagnosis } from '../db/localDB';

// Components
import Card from '../components/Card';
import Search from '../components/Search';
import SelectionFilter from '../components/SelectionFilter';
import ConfidenceLvlFilter from '../components/ConfidenceLvlFilter';
import CalendarFilter from '../components/CalendarFilter';
import ButtonFilter from '../components/ButtonFilter';

// Constants & Types
import { parasiteTypes } from '../assets/constants';
import { IAnalysis, FilterConfig } from '../types';
import 'rc-slider/assets/index.css';

const filters: FilterConfig[] = [
  { component: SelectionFilter, title: 'Filtrar por Parásito', options: parasiteTypes },
  { component: ConfidenceLvlFilter, title: 'Filtrar por Nivel de Confianza' },
  { component: CalendarFilter, title: 'Filtrar por Fecha', startingDate: 7, endingDate: 20 },
  { component: ButtonFilter, title: 'Filtrar por Estado de Retroalimentación' },
];

function History() {
  const navigate = useNavigate();

  // Consumimos el Store de Zustand correctamente tipado
  const { history, searchQuery, setSearchQuery } = useHistoryStore();

  // Lógica de filtrado, mapeo y ordenamiento centralizada
  const filteredAndSortedAnalyses = useMemo(() => {
    return history
      .filter((item: Diagnosis) => {
        const parasite = item.parasiteFound || '';
        const dateStr = item.date || '';
        const matchesSearch =
          parasite.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dateStr.includes(searchQuery);
        return matchesSearch;
      })
      .sort((a: Diagnosis, b: Diagnosis) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(
        (item: Diagnosis): IAnalysis => ({
          id: item.id || 0,
          date: item.date,
          content: item.parasiteFound || 'Análisis completado',
          imgURL: '', // Se gestionará dinámicamente en ScannerResults mediante el ID
          detectedParasites: [],
          fileName: `muestra_${item.id}.jpg`,
        })
      );
  }, [history, searchQuery]);

  const handleCardClick = (analysis: IAnalysis) => {
    navigate(`/results/${analysis.id}`, { state: { analysis } });
  };

  const containerStyle: CSSProperties = {
    // @ts-expect-error: CSS Variable personalizada para el diseño del checkbox
    '--checkbox-tick-svg': `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='rgb(16,24,22)' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`,
    fontFamily: 'Inter, "Noto Sans", sans-serif',
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden"
      style={containerStyle}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Panel Lateral de Filtros */}
          <aside className="layout-content-container flex flex-col w-80">
            <Search placeholder="Buscar por fecha, hora o parásito" onSearch={setSearchQuery} />
            {filters.map((Filter, index) => (
              <Filter.component key={`${Filter.title}-${index}`} {...Filter} />
            ))}
          </aside>

          {/* Listado Principal de Análisis */}
          <main className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <header className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <h1 className="text-[#101816] tracking-light text-[32px] font-bold leading-tight">
                  Revisar Análisis Anteriores
                </h1>
                <p className="text-[#5e8d81] text-base font-normal leading-normal">
                  Accede y gestiona el historial epidemiológico. Haz clic en cualquier entrada para
                  inspeccionar la morfología detectada y los puntos de confianza.
                </p>
              </div>
            </header>

            <section className="flex flex-col gap-3">
              <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Análisis Recientes
              </h2>
              {filteredAndSortedAnalyses.length > 0 ? (
                filteredAndSortedAnalyses.map((analysis: IAnalysis) => (
                  <Card
                    key={analysis.id}
                    title={`Análisis del ${analysis.date}`}
                    content={analysis.content}
                    imgURL={analysis.imgURL}
                    onClick={() => handleCardClick(analysis)}
                  />
                ))
              ) : (
                <p className="px-4 text-[#5e8d81] italic">
                  No hay análisis que coincidan con la búsqueda.
                </p>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default History;
