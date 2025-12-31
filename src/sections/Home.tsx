import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import BarChart from '../components/BarChart';
import HorizontalBarChart from '../components/HorizontalBarChart';
import ParGeoMap from '../assets/ParGeoMap';

// Tipos e interfaces
import { IDashboardData, EpidemiologicalCard } from '../types';
import dashboardDataRaw from '../assets/dashboardData.json';
import VenGeoURL from '../assets/venezuela.geojson?url';

// Definimos los datos del dashboard con el tipo correcto
const dashboardData = dashboardDataRaw as IDashboardData;

const epidemiologicalCards: EpidemiologicalCard[] = [
  { title: 'Edades', key: 'ages' },
  { title: 'Sexo', key: 'sex' },
  { title: 'Raza', key: 'race' },
  { title: 'Comorbilidades', key: 'comorbidities' },
  { title: 'Distribución Geográfica', key: 'geographicDistribution' },
  { title: 'Otros Factores', key: 'otherFactors' },
];

/**
 * @description Dashboard principal de vigilancia epidemiológica.
 * Visualiza la distribución de especies parasitarias y factores demográficos.
 */
const Home = () => {
  const [data, setData] = useState<IDashboardData | null>(null);
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // En un entorno real, esto sería una llamada a tu API/Worker
        setData(dashboardData);

        const response = await fetch(VenGeoURL);
        if (!response.ok) throw new Error('Error al cargar GeoJSON');
        const geoJson = await response.json();
        setGeoData(geoJson);
      } catch (error) {
        console.error('Dashboard Fetch Error:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#5e8d81] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#5e8d81] text-lg font-medium">
              Sincronizando datos epidemiológicos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { summary, epidemiology } = data;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />

        <main className="px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <header className="flex flex-wrap justify-between gap-3 p-4">
              <h1 className="text-[#101816] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Resumen de Datos Semanales
              </h1>
            </header>

            {/* Sección de Parásitos Detectados */}
            <section aria-labelledby="parasite-summary">
              <h2
                id="parasite-summary"
                className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
              >
                Parásitos Detectados
              </h2>
              <div className="flex flex-wrap gap-4 px-4 py-6">
                <Card title="Número y Especies">
                  <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight truncate">
                    {summary.parasitesDetected.count}
                  </p>
                  <div className="flex gap-1 mb-4">
                    <p className="text-[#5e8d81] text-base font-normal leading-normal">
                      Últimos 7 Días
                    </p>
                    <p className="text-[#07882e] text-base font-medium leading-normal">
                      {summary.parasitesDetected.change}
                    </p>
                  </div>
                  {/* Gráfico de barras vertical (D3) */}
                  <div className="min-h-[250px] w-full items-end justify-items-center">
                    <BarChart data={summary.parasitesChart} />
                  </div>
                </Card>
              </div>
            </section>

            {/* Sección de Epidemiología */}
            <section aria-labelledby="epidemiology-stats">
              <h2
                id="epidemiology-stats"
                className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
              >
                Factores Epidemiológicos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-6">
                {epidemiologicalCards.map((card) => (
                  <Card key={card.key} title={card.title}>
                    <div className="min-h-[200px]">
                      <HorizontalBarChart data={epidemiology[card.key]} />
                    </div>
                  </Card>
                ))}

                {/* Mapa Coroplético de Venezuela */}
                <div className="col-span-1 md:col-span-2 mt-4">
                  <Card title="Prevalencia por Estado">
                    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-[#dae7e3]">
                      <ParGeoMap geometry={geoData} />
                    </div>
                  </Card>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
