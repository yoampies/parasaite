import { useState, useTransition, useMemo } from 'react';
import Navbar from '../components/Navbar';
import RegularCard from '../components/RegularCard';
import Search from '../components/Search';
import { parasites } from '../assets/constants';
import { IParasite } from '../types';

const Library = () => {
  const [filterQuery, setFilterQuery] = useState('');

  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    startTransition(() => {
      setFilterQuery(value);
    });
  };

  const filteredParasites = useMemo(() => {
    const query = filterQuery.toLowerCase();
    return (parasites as IParasite[]).filter(
      (par) =>
        par.name.toLowerCase().includes(query) || par.description.toLowerCase().includes(query)
    );
  }, [filterQuery]);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />

        <main className="px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap gap-2 p-4">
              <span className="text-[#5e8d81] text-sm font-medium uppercase tracking-wider">
                Recursos Educativos
              </span>
            </div>

            <header className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <h1 className="text-[#101816] tracking-light text-[32px] font-bold leading-tight">
                  Biblioteca de Parásitos
                </h1>
                <p className="text-[#5e8d81] text-base font-normal leading-normal">
                  Explora nuestro catálogo detallado de helmintos y protozoarios.
                </p>
              </div>
            </header>

            <div className="w-full">
              <Search placeholder="Buscar por nombre o descripción..." onSearch={handleSearch} />
            </div>

            <section aria-labelledby="parasite-list-title">
              <div className="flex items-center justify-between px-4 pb-3 pt-5">
                <h2
                  id="parasite-list-title"
                  className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em]"
                >
                  {isPending ? 'Actualizando resultados...' : 'Especies Disponibles'}
                </h2>
                <span className="text-sm text-[#5e8d81] font-medium">
                  {filteredParasites.length} resultados
                </span>
              </div>

              <div
                className={`flex flex-col gap-2 transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}
              >
                {filteredParasites.map((par) => (
                  <RegularCard
                    key={par.id}
                    title={par.name}
                    content={par.description}
                    imgURL={par.imgURL}
                  />
                ))}

                {filteredParasites.length === 0 && (
                  <div className="p-8 text-center text-[#5e8d81]">
                    No se encontraron parásitos que coincidan con tu búsqueda.
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Library;
