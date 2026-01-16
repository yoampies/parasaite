import { memo, Fragment } from 'react';
import ModelCanvas from './ModelCanvas';
import { SectionRenderingProps } from '../types';

const SectionRendering = ({
  sections,
  parasiteName,
  scrollPositionRef,
  isExpanded,
  setIsExpanded,
  setExpandedModelPath,
  parasiteRotation,
}: SectionRenderingProps) => {
  const getModelPathForSection = (title: string): string | null => {
    const baseName = parasiteName;
    let suffix = '';

    const adultStages = ['Adulto', 'Trofozoíto'];
    const larvalStages = ['Huevo', 'Quiste', 'Larva'];

    if (adultStages.some((stage) => title.includes(stage))) {
      suffix = '_A';
    } else if (larvalStages.some((stage) => title.includes(stage))) {
      suffix = '_H';
    }

    return suffix ? `/models/${baseName}${suffix}.glb` : null;
  };

  return (
    <>
      {sections.map((section, index) => {
        const modelPath = getModelPathForSection(section.title);

        return (
          <Fragment key={`${parasiteName}-section-${index}`}>
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              {section.title}
            </h2>

            {section.text && (
              <p className="text-[#101816] text-base font-normal leading-normal pb-3 pt-1 px-4">
                {section.text}
              </p>
            )}

            {modelPath && !isExpanded && (
              <div className="w-full h-[500px] px-4 pt-2 pb-4">
                <p className="text-gray-500 text-sm italic mb-2">
                  ¡Haz clic sobre el parásito para inspeccionarlo en detalle!
                </p>
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
              <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4 mt-4">
                {section.stages.map((stage, stageIndex, stagesArray) => (
                  <Fragment key={`${section.title}-stage-${stageIndex}`}>
                    <div className="flex flex-col items-center gap-1 pt-3">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-6 border border-[#dae7e3]"
                        style={{ backgroundImage: `url("${stage.imgUrl}")` }}
                        role="img"
                        aria-label={`Imagen de etapa: ${stage.title}`}
                      ></div>
                      {stageIndex < stagesArray.length - 1 && (
                        <div className="w-[1.5px] bg-[#dae7e3] h-2 grow"></div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col py-3 border-b border-[#f0f5f4] last:border-none">
                      <p className="text-[#101816] text-base font-medium leading-normal">
                        {stage.title}
                      </p>
                      <p className="text-[#5e8d81] text-base font-normal leading-normal">
                        {stage.description}
                      </p>
                    </div>
                  </Fragment>
                ))}
              </div>
            )}
          </Fragment>
        );
      })}
    </>
  );
};

export default memo(SectionRendering);
