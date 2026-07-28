import { useEffect, useState, useMemo, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../hooks/UseHistoryStore';
import { Diagnosis } from '../db/localDB';
import { exportDiagnosesToCSV } from '../utils/csvExporter';

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

  // Consumimos el store
  const { history, searchQuery, setSearchQuery, loadHistory, loadFrameForDiagnosis, isLoading } =
    useHistoryStore();

  // Estado local para almacenar el mapa de { diagnosisId -> objectUrl }
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});

  // 1. Cargar el historial desde Dexie al montar la vista
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // 2. Cargar asíncronamente los Blobs de imágenes para cada diagnóstico en el historial
  useEffect(() => {
    let isMounted = true;
    const createdUrls: string[] = [];

    const fetchImages = async () => {
      const urlsMap: Record<number, string> = {};

      for (const item of history) {
        if (item.id) {
          const blob = await loadFrameForDiagnosis(item.id);
          if (blob && isMounted) {
            const url = URL.createObjectURL(blob);
            createdUrls.push(url);
            urlsMap[item.id] = url;
          }
        }
      }

      if (isMounted) {
        setImageUrls(urlsMap);
      }
    };

    if (history.length > 0) {
      fetchImages();
    }

    // Limpieza de URLs de memoria al desmontar
    return () => {
      isMounted = false;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [history, loadFrameForDiagnosis]);

  // 3. Filtrar, ordenar y mapear los diagnósticos asociando la URL de imagen recuperada
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
          imgURL: item.id ? imageUrls[item.id] || '' : '',
          detectedParasites: [],
          fileName: `muestra_${item.id}.jpg`,
        })
      );
  }, [history, searchQuery, imageUrls]);

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
              <button
                onClick={exportDiagnosesToCSV}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Exportar Todo (CSV)
              </button>
              {isLoading ? (
                <p className="px-4 text-[#5e8d81] italic">Cargando historial...</p>
              ) : filteredAndSortedAnalyses.length > 0 ? (
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
