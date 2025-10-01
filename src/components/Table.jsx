import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * @description Componente de tabla para mostrar una lista de parásitos y sus niveles de confianza.
 * Maneja la visualización de datos, incluyendo el caso donde no hay elementos
 *
 * @param {object} props - Propiedades del componente.
 * @param {Array<Object>} props.parasites - Un array de objetos de parásitos, cada uno con 'label' y 'value'.
 */
function Table({ parasites }) {

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
                    {parasites.length === 0 ? (
                        <tr className="border-t border-t-[#dae7e3]">
                            <td colSpan="3" className="px-4 py-8 text-center text-[#5e8d81]">
                                No se encontraron parásitos en este análisis.
                            </td>
                        </tr>
                    ) : (
                        parasites.map((parasite, index) => (
                            <tr key={index} className="border-t border-t-[#dae7e3]">
                                <td className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101816] text-sm font-normal leading-normal">{parasite.label}</td>
                                <td className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5e8d81] text-sm font-normal leading-normal">{parasite.value}%</td>
                                <td className="table-19802f9d-f175-4978-ab8d-8885be3b1253-column-360 h-[72px] px-4 py-2 w-60 text-[#5e8d81] text-sm font-bold leading-normal tracking-[0.015em]">
                                    <Link to={`/library/${parasite.label.toLowerCase().replace(/\s/g, '-')}`} className="text-[#101816] hover:underline">
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

// **Validación de Propiedades con PropTypes**
Table.propTypes = {
  parasites: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Table;