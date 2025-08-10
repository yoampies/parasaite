import React from 'react'

function Table() {
  return (
    <div className="flex overflow-hidden rounded-lg border border-[#dae7e3] bg-white">
        <table className="flex-1">
            <thead>
            <tr className="bg-white">
                <th className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-120 px-4 py-3 text-left text-[#101816] w-[400px] text-sm font-medium leading-normal">Parásito</th>
                <th className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-240 px-4 py-3 text-left text-[#101816] w-[400px] text-sm font-medium leading-normal">Confianza</th>
                <th className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-360 px-4 py-3 text-left text-[#101816] w-60 text-[#5e8d81] text-sm font-medium leading-normal">Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr className="border-t border-t-[#dae7e3]">
                <td className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101816] text-sm font-normal leading-normal">Plasmodium falciparum</td>
                <td className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5e8d81] text-sm font-normal leading-normal">95%</td>
                <td className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-360 h-[72px] px-4 py-2 w-60 text-[#5e8d81] text-sm font-bold leading-normal tracking-[0.015em]">Ver Detalles</td>
            </tr>
            <tr className="border-t border-t-[#dae7e3]">
                <td className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101816] text-sm font-normal leading-normal">Plasmodium vivax</td>
                <td className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5e8d81] text-sm font-normal leading-normal">88%</td>
                <td className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-360 h-[72px] px-4 py-2 w-60 text-[#5e8d81] text-sm font-bold leading-normal tracking-[0.015em]">Ver Detalles</td>
            </tr>
            <tr className="border-t border-t-[#dae7e3]">
                <td className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101816] text-sm font-normal leading-normal">Plasmodium malariae</td>
                <td className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5e8d81] text-sm font-normal leading-normal">72%</td>
                <td className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-360 h-[72px] px-4 py-2 w-60 text-[#5e8d81] text-sm font-bold leading-normal tracking-[0.015em]">Ver Detalles</td>
            </tr>
            </tbody>
        </table>
    </div>
  )
}

export default Table