import Navbar from '../components/Navbar';
import RegularCard from '../components/RegularCard';
import { parasites } from '../assets/constants';
import { IParasite } from '../types';

/**
 * @description Página de la Biblioteca de Parásitos.
 * Actúa como un repositorio educativo donde los usuarios pueden explorar 
 * la morfología y patogenia de diferentes especies.
 */
const Library = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        
        <main className="px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            
            {/* Breadcrumb / Indicador de sección */}
            <div className="flex flex-wrap gap-2 p-4">
              <span className="text-[#5e8d81] text-sm font-medium uppercase tracking-wider">
                Recursos Educativos
              </span>
            </div>

            {/* Encabezado Principal */}
            <header className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <h1 className="text-[#101816] tracking-light text-[32px] font-bold leading-tight">
                  Biblioteca de Parásitos
                </h1>
                <p className="text-[#5e8d81] text-base font-normal leading-normal">
                  Explora nuestro catálogo detallado de helmintos y protozoarios. 
                  Accede a modelos 3D interactivos, descripciones morfológicas y ciclos de vida.
                </p>
              </div>
            </header>

            {/* Listado de Parásitos */}
            <section aria-labelledby="parasite-list-title">
              <h2 
                id="parasite-list-title" 
                className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
              >
                Especies Disponibles
              </h2>
              
              <div className="flex flex-col gap-2">
                {(parasites as IParasite[]).map((par) => (
                  <RegularCard 
                    key={par.id} 
                    title={par.name} 
                    content={par.description} 
                    imgURL={par.imgURL}
                  />
                ))}
              </div>
            </section>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Library;