import React from 'react';
import Navbar from '../components/Navbar';
import RegularCard from '../components/RegularCard'; // Importamos el componente RegularCard
import { parasites } from '../assets/constants';

/**
 * @description Componente de la página "Biblioteca de Parásitos". Muestra un listado
 * de parásitos cargados desde un archivo de datos, cada uno representado por una tarjeta
 * navegable.
 */
const Library = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Sección de encabezado */}
            <div className="flex flex-wrap gap-2 p-4">
              <span className="text-[#101816] text-base font-medium leading-normal">Biblioteca de Parásitos</span>
            </div>
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight">Biblioteca de Parásitos</p>
                <p className="text-[#5e8d81] text-sm font-normal leading-normal">Explora la lista de parásitos</p>
              </div>
            </div>

            {/* Sección del listado de parásitos */}
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Parásitos</h2>
            {
              parasites.map((par) => (
                <RegularCard 
                  key={par.id} 
                  title={par.name} 
                  content={par.description} 
                  imgURL={par.imgURL}
                />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;