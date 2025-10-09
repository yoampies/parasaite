import React, { memo } from 'react';
import ModelCanvas from './ModelCanvas';

function SectionRendering({ sections, parasiteName, scrollPositionRef, isExpanded, setIsExpanded, setExpandedModelPath, parasiteRotation }) {
  // Esta función genera la ruta del modelo 3D basándose en el nombre completo del parásito y el título de la sección
  const getModelPathForSection = (title) => {
    // Usamos el 'parasiteName' completo de la URL para que coincida con el nombre de tus archivos GLB
    const baseName = parasiteName;
    
    let suffix = '';
    const adultStages = ['Adulto', 'Trofozoíto'];
    const larvalStages = ['Huevo', 'Quiste', 'Larva'];

    if (adultStages.some(stage => title.includes(stage))) {
      suffix = '_A';
    } else if (larvalStages.some(stage => title.includes(stage))) {
      suffix = '_H';
}

    // Si se encontró un sufijo, construimos la ruta completa del modelo
    if (suffix) {
      return `/models/${baseName}${suffix}.glb`;
    }

    // Si no es una sección de morfología de adulto o huevo, no hay modelo 3D
    return null;
  };

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
            {modelPath && !isExpanded && (
              <div className="w-full h-[500px] p-4">
                <ModelCanvas 
                  modelPath={modelPath} 
                  rotation={parasiteRotation}
                  scrollPositionRef={scrollPositionRef}
                  setIsExpanded={setIsExpanded}
                  setExpandedModelPath={setExpandedModelPath}
                />
              </div>
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

export default memo(SectionRendering);