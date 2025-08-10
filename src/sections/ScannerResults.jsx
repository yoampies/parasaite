import Navbar from "../components/Navbar"
import Table from "../components/Table"

function ScannerResults() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar/>
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight min-w-72">Resultados del Análisis</p>
            </div>
            <div className="flex w-full grow bg-white @container p-4">
              <div className="w-full gap-1 overflow-hidden bg-white @[480px]:gap-2 aspect-[3/2] rounded-lg flex">
                <div className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBmiJsp_wW3esvJpGmw7tyP5jcEJ64XbmrU0c2WpWL4esN-mG9uP4vB021gNgTMfID9Y9dbxWgaAKnM4JJDyNWs5dCn7itLMOhEvxIyoSgHF-ERsy-h8m5pGBjA74toE2do4e_3nPKlJ-VVmq2mn2pqB3fIh4Ll2pRKB99tjaQT0NyMeGVLpFnZn-t4HCUX62eHY5RuUvu2Ym_p3K2_XmbUI0xEPjeliftWUNX8DA-Gfhtu6jVRUc0Q-aATtr1hLUynbJsya5p5_YJS")` }}></div>
              </div>
            </div>
            <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Parásitos Detectados</h3>
            <div className="px-4 py-3 @container">
              <Table />
              <style>
                {`
                  @container (max-width: 120px) { .table-19802f9d-f175-4978-ab8d-8885be3b1253-column-120 { display: none; } }
                  @container (max-width: 240px) { .table-19802f9d-f175-4978-ab8d-8885be3b1253-column-240 { display: none; } }
                  @container (max-width: 360px) { .table-19802f9d-f175-4978-ab8d-8885be3b1253-column-360 { display: none; } }
                `}
              </style>
            </div>
          </div>
          <div className="layout-content-container flex flex-col w-[360px]">
            <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Resumen del Análisis</h3>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dae7e3] p-6">
                <p className="text-[#101816] text-base font-medium leading-normal">Distribución de Parásitos</p>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: `90%` }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">P. falciparum</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: `50%` }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">P. vivax</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: `0%` }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">P. malariae</p>
                </div>
              </div>
            </div>
            <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Comentarios y Correcciones</h3>
            <p className="text-[#101816] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Ayúdanos a mejorar nuestro modelo de detección proporcionando comentarios sobre el análisis. Puedes corregir cualquier parásito mal identificado o agregar nuevos.
            </p>
            <div className="flex px-4 py-3 justify-end">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#00c795] text-[#101816] text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Enviar Comentarios</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScannerResults