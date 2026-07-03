import { useEffect } from 'react';
import Model from './Model';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useModelLogic } from '../hooks/UseModelLogic';
import { ExpandedModelCardProps } from '../types/index';

function ExpandedModelCard({
  isExpanded,
  setIsExpanded,
  modelPath,
  rotation,
}: ExpandedModelCardProps) {
  const isAscaris = modelPath === '/3d_models/ascaris-lumbricoides_A.glb';
  const ascarisCloseUp: [number, number, number] = isAscaris ? [0, 0.5, 1] : [0, 0, 3];
  const yOffset = isAscaris ? 0.3 : 0;

  const {
    activePart,
    setActivePart,
    isXRayEnabled,
    setIsXRayEnabled,
    focusPoint,
    setFocusPoint,
    parasiteDetails,
  } = useModelLogic(modelPath, yOffset);

  useEffect(() => {
    return () => {
      useGLTF.clear(modelPath);
    };
  }, [modelPath]);

  const xrayButtonClass = isXRayEnabled
    ? 'bg-[#5e8d81] text-white hover:bg-[#48736a]'
    : 'bg-[#f0f5f4] text-[#101816] hover:bg-[#dae7e3]';

  return (
    <div className="!fixed w-full h-full bg-black/60 z-50 inset-0 flex p-4">
      <div className="flex flex-col md:flex-row w-full h-full bg-white max-h-[85vh] max-w-[95vw] md:max-w-[85vw] m-auto rounded-xl shadow-2xl overflow-hidden relative">
        <Canvas
          camera={{ position: ascarisCloseUp, fov: 45 }}
          className="w-full h-1/2 md:w-2/3 md:h-full block"
          dpr={[1, 2]}
        >
          <Model
            modelPath={modelPath}
            rotation={rotation}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            activePart={activePart}
            setActivePart={setActivePart}
            isXRayEnabled={isXRayEnabled}
            focusPoint={focusPoint}
            setFocusPoint={setFocusPoint}
            yOffset={yOffset}
          />
        </Canvas>

        <div className="w-full h-1/2 md:w-1/3 md:h-full bg-white p-6 md:p-8 flex flex-col justify-center overflow-y-auto z-10 relative">
          <h3 className="text-[#101816] text-[20px] md:text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
            {parasiteDetails.title}
          </h3>
          <p className="text-[#101816] text-sm md:text-base leading-normal font-normal text-justify">
            {parasiteDetails.description}
          </p>
        </div>
      </div>

      {/* Botón de cerrar: Ajustado z-index para que siempre esté encima */}
      <button
        className="absolute top-4 right-4 md:top-6 md:right-10 text-white text-3xl z-[60] bg-black/50 rounded-full p-1 w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
        onClick={() => setIsExpanded(false)}
      >
        &times;
      </button>

      {/* Botón Rayos X: Ajustado para no tapar contenido en móvil */}
      <button
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-[60] 
                    flex items-center justify-center overflow-hidden rounded-lg h-10
                    text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 transition-colors shadow-lg
                    ${xrayButtonClass}`}
        onClick={() => setIsXRayEnabled(!isXRayEnabled)}
      >
        {isXRayEnabled ? 'Desactivar Rayos X' : 'Activar Rayos X'}
      </button>
    </div>
  );
}

export default ExpandedModelCard;
