import { useState, useEffect, Suspense, lazy } from 'react';
import { useMediaQuery } from 'react-responsive';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import BarChart from '../components/BarChart';
import HorizontalBarChart from '../components/HorizontalBarChart';

import * as topojson from 'topojson-client';
import { useInView } from 'react-intersection-observer';

const ParGeoMap = lazy(() => import('../assets/ParGeoMap'));

import { IDashboardData, EpidemiologicalCard } from '../types';
import dashboardDataRaw from '../assets/dashboardData.json';
import VenGeoURL from '../assets/venezuela.json?url';

const dashboardData = dashboardDataRaw as IDashboardData;

const epidemiologicalCards: EpidemiologicalCard[] = [
  { title: 'Edades', key: 'ages' },
  { title: 'Sexo', key: 'sex' },
  { title: 'Raza', key: 'race' },
  { title: 'Comorbilidades', key: 'comorbidities' },
  { title: 'Distribución Geográfica', key: 'geographicDistribution' },
  { title: 'Otros Factores', key: 'otherFactors' },
];

const Home = () => {
  const [geoData, setGeoData] = useState<any>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const { ref: mapRef, inView } = useInView({
    triggerOnce: true,
    threshold: isMobile ? 0.5 : 0.1,
    rootMargin: isMobile ? '0px' : '200px',
  });

  useEffect(() => {
    // Solo iniciamos la secuencia de red/proceso si el componente es visible
    if (inView && !geoData) {
      const fetchGeoData = async () => {
        try {
          const response = await fetch(VenGeoURL);
          if (!response.ok) throw new Error('Error Mapa');
          const topology = await response.json();
          const objectKey = Object.keys(topology.objects)[0];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const geoJson = topojson.feature(topology, topology.objects[objectKey] as any);
          setGeoData(geoJson);
        } catch (error) {
          console.error(error);
        }
      };
      fetchGeoData();
    }
  }, [inView, geoData]);

  // [OPTIMIZACIÓN 3] Accesibilidad (Contraste)
  // Oscurecí ligeramente los colores de texto para pasar el ratio 4.5:1
  const { summary, epidemiology } = dashboardData;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />

        <main className="px-6 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <header className="flex flex-wrap justify-between gap-3 p-4">
              {/* LCP Element: Renderizado inmediato */}
              <h1 className="text-[#0d1413] tracking-light text-[28px] lg:text-[32px] font-bold leading-tight min-w-72">
                Resumen de Datos Semanales
              </h1>
            </header>

            <section aria-labelledby="parasite-summary">
              <h2
                id="parasite-summary"
                className="text-[#0d1413] text-[22px] font-bold px-4 pb-3 pt-5"
              >
                Parásitos Detectados
              </h2>
              <div className="flex flex-wrap gap-4 px-4 py-6">
                <Card title="Número y Especies">
                  <p className="text-[#0d1413] tracking-light text-[32px] font-bold leading-tight truncate">
                    {summary.parasitesDetected.count}
                  </p>
                  <div className="flex gap-1 mb-4">
                    {/* Contraste mejorado para accesibilidad */}
                    <p className="text-[#4a7a6f] text-base font-normal">Últimos 7 Días</p>
                    <p className="text-[#067026] text-base font-medium">
                      {summary.parasitesDetected.change}
                    </p>
                  </div>
                  <div className="min-h-[250px] w-full items-end justify-items-center">
                    <BarChart data={summary.parasitesChart} />
                  </div>
                </Card>
              </div>
            </section>

            <section aria-labelledby="epidemiology-stats">
              <h2
                id="epidemiology-stats"
                className="text-[#0d1413] text-[22px] font-bold px-4 pb-3 pt-5"
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

                <div className="col-span-1 md:col-span-2 mt-4">
                  <Card title="Prevalencia por Estado">
                    <div
                      ref={mapRef}
                      className="h-[400px] w-full rounded-lg overflow-hidden border border-[#dae7e3] relative bg-gray-50"
                    >
                      {/* Suspense solo para el componente pesado */}
                      <Suspense
                        fallback={
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                            Cargando Visualización...
                          </div>
                        }
                      >
                        {/* Render condicional estricto */}
                        {inView && geoData ? <ParGeoMap geometry={geoData} /> : null}
                      </Suspense>
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
