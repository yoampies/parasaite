import { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import BarChart from '../components/BarChart';
import HorizontalBarChart from '../components/HorizontalBarChart';

// [NUEVO] Librerías para performance y mapas
import * as topojson from 'topojson-client';
import { useInView } from 'react-intersection-observer';

// Lazy load del componente pesado
const ParGeoMap = lazy(() => import('../assets/ParGeoMap'));

import { IDashboardData, EpidemiologicalCard } from '../types';
import dashboardDataRaw from '../assets/dashboardData.json';

// Importa el archivo tal cual se descargó (probablemente sea .json o .geojson)
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
  const [data, setData] = useState<IDashboardData | null>(null);
  const [geoData, setGeoData] = useState<any>(null);

  // [PERFORMANCE] Hook para detectar cuando el usuario hace scroll hasta el mapa
  const { ref: mapRef, inView } = useInView({
    triggerOnce: true, // Solo carga una vez, no cada vez que entras/sales
    threshold: 0.1, // Empieza a cargar cuando se ve el 10% del contenedor
    rootMargin: '200px', // Pre-carga 200px antes de llegar (para que se sienta instantáneo)
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(dashboardData);

        // Solo descargamos el mapa si el usuario está cerca de verlo (o si ya cargó antes)
        // NOTA: Si prefieres cargar el mapa siempre en background, quita el 'if (inView)'
        // pero para performance extrema, déjalo.

        const response = await fetch(VenGeoURL);
        if (!response.ok) throw new Error('Error al cargar Mapa');

        const topology = await response.json();

        // [CONVERSIÓN AUTOMÁTICA TOPOJSON -> GEOJSON]
        // Detecta dinámicamente la llave (ej. "venezuela", "VEN_adm1", "collection")
        const objectKey = Object.keys(topology.objects)[0];

        // Descomprime la topología a GeoJSON estándar para D3
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const geoJson = topojson.feature(topology, topology.objects[objectKey] as any);

        setGeoData(geoJson);
      } catch (error) {
        console.error('Dashboard Fetch Error:', error);
      }
    };

    fetchData();
  }, []); // El mapa es estático, solo necesitamos cargarlo una vez al montar

  if (!data) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#5e8d81] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#5e8d81] text-lg font-medium">Sincronizando...</p>
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

            {/* Sección de Parásitos */}
            <section aria-labelledby="parasite-summary">
              <h2
                id="parasite-summary"
                className="text-[#101816] text-[22px] font-bold px-4 pb-3 pt-5"
              >
                Parásitos Detectados
              </h2>
              <div className="flex flex-wrap gap-4 px-4 py-6">
                <Card title="Número y Especies">
                  <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight truncate">
                    {summary.parasitesDetected.count}
                  </p>
                  <div className="flex gap-1 mb-4">
                    <p className="text-[#5e8d81] text-base font-normal">Últimos 7 Días</p>
                    <p className="text-[#07882e] text-base font-medium">
                      {summary.parasitesDetected.change}
                    </p>
                  </div>
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
                className="text-[#101816] text-[22px] font-bold px-4 pb-3 pt-5"
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

                {/* Mapa Coroplético */}
                <div className="col-span-1 md:col-span-2 mt-4">
                  <Card title="Prevalencia por Estado">
                    {/* [OPTIMIZACIÓN] El ref va aquí para detectar visibilidad */}
                    <div
                      ref={mapRef}
                      className="h-[400px] w-full rounded-lg overflow-hidden border border-[#dae7e3] relative"
                    >
                      <Suspense
                        fallback={
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-500 animate-pulse">
                            Cargando Geometría...
                          </div>
                        }
                      >
                        {inView && geoData ? (
                          <ParGeoMap geometry={geoData} />
                        ) : (
                          <div className="w-full h-full bg-gray-50" />
                        )}
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
