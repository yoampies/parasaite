import React from 'react';
import Model from '../components/Model';

function SectionRendering({ sections, parasiteName }) {
  // Esta función genera la ruta del modelo 3D basándose en el nombre completo del parásito y el título de la sección
  const getModelPathForSection = (title) => {
    // Usamos el 'parasiteName' completo de la URL para que coincida con el nombre de tus archivos GLB.
    const baseName = parasiteName;
    
    let suffix = '';
    if (title.includes('Adulto') || title.includes('Trofozoíto')) {
      suffix = '_A';
    } else if (title.includes('Huevo') || title.includes('Quiste') || title.includes('Larva')) {
      suffix = '_H';
    }

    // Si se encontró un sufijo, construimos la ruta completa del modelo
    if (suffix) {
      return `/models/${baseName}${suffix}.glb`;
    }

    // Si no es una sección de morfología de adulto o huevo, no hay modelo 3D
    return null;
  };

  const parasiteRotation = parasiteName === 'ascaris-lumbricoides' || 'enterobius-vermicularis' || 'trichuris-trichiura' ? [-2.5, -2, 0] : [0, 0, 0];

  return (
    <>
      {sections.map((section, index) => {
        // Obtenemos la ruta del modelo 3D para la sección actual
        const modelPath = getModelPathForSection(section.title);
        return (
          <React.Fragment key={index}>
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              {section.title}
            </h2>
            {section.text && (
              <p className="text-[#101816] text-base font-normal leading-normal pb-3 pt-1 px-4">
                {section.text}
              </p>
            )}

            {/* Renderizado condicional: si hay una ruta de modelo 3D, muestra el modelo */}
            {modelPath ? (
              <div className="w-full h-[500px] p-4">
                <Model modelPath={modelPath} rotation={parasiteRotation}/>
              </div>
            ) : (
              // De lo contrario, si hay una imgUrl, muestra la imagen estática
              section.imgUrl && (
                <div className="p-4">
                  <div
                    className="relative flex items-center justify-center bg-[#101816] bg-cover bg-center aspect-video rounded-lg p-4"
                    style={{ backgroundImage: `url("${section.imgUrl}")` }}
                  >
                    <button className="flex shrink-0 items-center justify-center rounded-full size-16 bg-black/40 text-white">
                      <div className="text-inherit" data-icon="Play" data-size="24px" data-weight="fill">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              )
            )}
            
            {section.stages && (
              <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
                {section.stages.map((stage, stageIndex) => (
                  <React.Fragment key={stageIndex}>
                    <div className="flex flex-col items-center gap-1 pt-3">
                      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-6" style={{ backgroundImage: `url("${stage.imgUrl}")` }}></div>
                      {stageIndex < section.stages.length - 1 && <div className="w-[1.5px] bg-[#dae7e3] h-2 grow"></div>}
                    </div>
                    <div className="flex flex-1 flex-col py-3">
                      <p className="text-[#101816] text-base font-medium leading-normal">{stage.title}</p>
                      <p className="text-[#5e8d81] text-base font-normal leading-normal">{stage.description}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default SectionRendering;