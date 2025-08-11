//Built-in Hooks and Components
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
//Components
import Navbar from '../components/Navbar'; 
import Error from '../components/Error';
import SectionRendering from '../components/SectionRendering';
//Constants
import { parasites, parasiteData } from '../assets/constants';

const ParasiteDetails = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { parasiteName } = useParams();

  const parasite = parasites.find(
    (p) => p.name.toLowerCase().replace(/\s/g, '-') === parasiteName
  );

  if (!parasite) {
    return (
      <Error title="Error: Parásito no encontrado" message="Lo sentimos, no pudimos encontrar los detalles para este parásito."
             linkText="Volver a la librería de parásitos" linkTo="/library"/>
    );
  }

  const currentParasiteData = parasiteData[parasiteName];
  const sections = currentParasiteData.tabs[activeTab]?.sections || [];
  
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap gap-2 p-4">
              <Link to="/library" className="text-[#5e8d81] text-base font-medium leading-normal hover:underline">
                Librería de Parásitos
              </Link>
              <span className="text-[#5e8d81] text-base font-medium leading-normal">/</span>
              <span className="text-[#101816] text-base font-medium leading-normal">{parasite.name}</span>
            </div>
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight">{parasite.name}</p>
                <p className="text-[#5e8d81] text-sm font-normal leading-normal">{currentParasiteData.subtitle}</p>
              </div>
            </div>
            <div className="pb-3">
              <div className="flex border-b border-[#dae7e3] px-4 gap-8">
                {Object.keys(currentParasiteData.tabs).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${activeTab === tab ? 'border-b-[#101816] text-[#101816]' : 'border-b-transparent text-[#5e8d81]'}`}
                  >
                    <p className="text-sm font-bold leading-normal tracking-[0.015em] capitalize">
                      {tab === 'overview'
                        ? 'Generalidades'
                        : tab === 'morphology'
                        ? 'Morfología'
                        : 'Ciclo de Vida'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <SectionRendering sections={sections}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParasiteDetails;