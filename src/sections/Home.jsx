import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import BarChart from "../components/BarChart";
import HorizontalBarChart from '../components/HorizontalBarChart';
import dashboardData from "../assets/dashboardData.json";
import ParGeoMap from "../assets/ParGeoMap"
import VenGeoURL from "../assets/venezuela.geojson?url"

// Define the data structure for the epidemiological cards
const epidemiologicalCards = [
  { title: "Edades", key: "ages" },
  { title: "Sexo", key: "sex" },
  { title: "Raza", key: "race" },
  { title: "Comorbilidades", key: "comorbidities" },
  { title: "Distribución Geográfica", key: "geographicDistribution" },
  { title: "Otros Factores", key: "otherFactors" },
];

/**
 * @description Página principal del panel de control. Muestra un resumen de datos semanales
 * con estadísticas clave y gráficos de parásitos y epidemiología
 */
const Home = () => {
  const [data, setData] = useState(null);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Simulate an API call with a delay for a more realistic loading experience.
    const fetchData = async () => {
      // await new Promise(resolve => setTimeout(resolve, 500)); // Simulate a delay
      setData(dashboardData);

      const response = await fetch(VenGeoURL);
      const geoJson = await response.json();
      setGeoData(geoJson);
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[#5e8d81] text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const { summary, epidemiology } = data;

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-inter"
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight min-w-72">Resumen de Datos Semanales</p>
            </div>

            {/* Sección de Parásitos Detectados */}
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Parásitos Detectados</h2>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <Card title="Número y Especies">
                <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight truncate">{summary.parasitesDetected.count}</p>
                <div className="flex gap-1">
                  <p className="text-[#5e8d81] text-base font-normal leading-normal">Últimos 7 Días</p>
                  <p className="text-[#07882e] text-base font-medium leading-normal">{summary.parasitesDetected.change}</p>
                </div>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  <BarChart data={summary.parasitesChart} />
                </div>
              </Card>
            </div>

            {/* Sección de Epidemiología */}
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Epidemiología</h2>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              {epidemiologicalCards.map(card => (
                <Card key={card.key} title={card.title}>
                  <HorizontalBarChart data={epidemiology[card.key]} />
                </Card>
              ))}
              <ParGeoMap geometry={geoData}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;