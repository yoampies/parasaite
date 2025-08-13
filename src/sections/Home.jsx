import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import BarChart from "../components/BarChart";
import HorizontalBarChart from '../components/HorizontalBarChart';
import dashboardData from "../assets/dashboardData.json";

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // In a real application, you would use an API call here.
    // For this example, we'll just set the data from the imported JSON file.
    setData(dashboardData);
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight min-w-72">Resumen de Datos Semanales</p>
            </div>
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Parásitos Detectados</h2>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <Card title="Número y Especies">
                <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight truncate">{data.summary.parasitesDetected.count}</p>
                <div className="flex gap-1">
                  <p className="text-[#5e8d81] text-base font-normal leading-normal">Últimos 7 Días</p>
                  <p className="text-[#07882e] text-base font-medium leading-normal">{data.summary.parasitesDetected.change}</p>
                </div>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  <BarChart data={data.summary.parasitesChart} />
                </div>
              </Card>
            </div>
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Epidemiología</h2>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <Card title="Edades">
                <HorizontalBarChart data={data.epidemiology.ages} />
              </Card>
              <Card title="Sexo">
                <HorizontalBarChart data={data.epidemiology.sex} />
              </Card>
              <Card title="Raza"> 
                <HorizontalBarChart data={data.epidemiology.race} />
              </Card>
              <Card title="Comorbilidades"> 
                <HorizontalBarChart data={data.epidemiology.comorbidities} />
              </Card>
              <Card title="Distribución Geográfica">
                <HorizontalBarChart data={data.epidemiology.geographicDistribution} />
              </Card>
              <Card title="Otros Factores">
                <HorizontalBarChart data={data.epidemiology.otherFactors} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;