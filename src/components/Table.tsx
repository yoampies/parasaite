import { Link } from 'react-router-dom';
import { TableProps } from '../types';

/**
 * @description Componente de tabla para mostrar los resultados de la detección por IA.
 * Presenta el nombre del parásito, el nivel de confianza del modelo y un enlace al informe detallado.
 */
function Table({ parasites }: TableProps) {
  
  // Función para generar slugs consistentes para las URLs
  const getParasiteSlug = (label: string) => 
    label.toLowerCase().trim().replace(/\s+/g, '-');

  return (
    <div className="flex overflow-hidden rounded-lg border border-[#dae7e3] bg-white">
      <table className="flex-1">
        <thead>
          <tr className="bg-white">
            <th className="px-4 py-3 text-left text-[#101816] w-[400px] text-sm font-medium leading-normal">
              Parásito
            </th>
            <th className="px-4 py-3 text-left text-[#101816] w-[400px] text-sm font-medium leading-normal">
              Confianza
            </th>
            <th className="px-4 py-3 text-left text-[#5e8d81] w-60 text-sm font-medium leading-normal">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {parasites.length === 0 ? (
            <tr className="border-t border-t-[#dae7e3]">
              <td colSpan={3} className="px-4 py-8 text-center text-[#5e8d81]">
                No se encontraron parásitos en este análisis.
              </td>
            </tr>
          ) : (
            parasites.map((parasite, index) => (
              <tr key={`${parasite.label}-${index}`} className="border-t border-t-[#dae7e3] hover:bg-[#fbfcfc] transition-colors">
                <td className="h-[72px] px-4 py-2 w-[400px] text-[#101816] text-sm font-normal leading-normal">
                  {parasite.label}
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-[#5e8d81] text-sm font-normal leading-normal">
                  {parasite.value.toFixed(1)}%
                </td>
                <td className="h-[72px] px-4 py-2 w-60 text-[#5e8d81] text-sm font-bold leading-normal tracking-[0.015em]">
                  <Link 
                    to={`/library/${getParasiteSlug(parasite.label)}`} 
                    className="text-[#101816] hover:underline hover:text-[#00c795] transition-colors"
                  >
                    Ver Informe
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;