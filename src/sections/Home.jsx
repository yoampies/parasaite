import Navbar from "../components/Navbar";
import Card from "../components/Card";

const Home = () => {
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
                <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight truncate">120</p>
                <div className="flex gap-1">
                  <p className="text-[#5e8d81] text-base font-normal leading-normal">Últimos 7 Días</p>
                  <p className="text-[#07882e] text-base font-medium leading-normal">+15%</p>
                </div>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: '20%' }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Tipo A</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: '80%' }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Tipo B</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: '40%' }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Tipo C</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: '20%' }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Tipo D</p>
                </div>
              </Card>
            </div>
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Epidemiología</h2>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <Card title="Edades">
                <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">0-18</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '50%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">19-35</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '80%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">36-60</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '60%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">61+</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '10%' }}></div></div>
                </div>
              </Card>
              <Card title="Sexo">
                <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Hombre</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '10%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Mujer</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '60%' }}></div></div>
                </div>
              </Card>
              <Card title="Raza"> 
                <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Caucásico</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '90%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Afroamericano</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '20%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Asiático</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '20%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Otro</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '50%' }}></div></div>
                </div>
              </Card>
              <Card title="Comorbilidades">  
                <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Diábetes</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '80%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Hipertensión</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '70%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Enfermedad Cardiovascular</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '10%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Ninguna</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '90%' }}></div></div>
                </div>
              </Card>
              <Card title="Distribución Geográfica">
                <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Urbana</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '70%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Rural</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '20%' }}></div></div>
                </div>
              </Card>
              <Card title="Otros Factores">
                <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Travel History</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '30%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Occupation</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '50%' }}></div></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Socioeconomic Status</p>
                  <div className="h-full flex-1"><div className="border-[#5e8d81] bg-[#f0f5f4] border-r-2 h-full" style={{ width: '30%' }}></div></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;