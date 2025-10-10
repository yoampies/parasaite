import React, {useState, useEffect} from 'react'
import Model from './Model'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei';
import { model_mesh_details } from '../assets/constants';

function ExpandedModelCard({isExpanded, setIsExpanded, modelPath, rotation}) {

    const [activePart, setActivePart] = useState(null);
    const [isXRayEnabled, setIsXRayEnabled] = useState(false);

    const ascarisCloseUp = modelPath === "/models/ascaris-lumbricoides_A.glb" ? [0, 0.5, 1] : [0, 0, 3];
    const yOffset = modelPath === "/models/ascaris-lumbricoides_A.glb" ? 0.3 : 0;

    const parts = modelPath.split("/");
    const filename = parts.pop();
    const fullModelSlug = filename.replace(".glb", "");
    const parasiteData = model_mesh_details[fullModelSlug];
    let parasiteDetails;
    if (isXRayEnabled) {
        parasiteDetails = parasiteData?.["XRAY_DETAILS"];
    } else {
        parasiteDetails = parasiteData?.[activePart] || parasiteData?.["DEFAULT"];
    }
    
    useEffect(() => {
        return () => {
            // Limpia el caché GLTF global cuando el canvas pequeño se desmonta
            useGLTF.clear(modelPath); 
        };
    }, [modelPath]);

  const xrayButtonClass = isXRayEnabled 
        ? "bg-[#5e8d81] text-white hover:bg-[#48736a]" 
        : "bg-[#f0f5f4] text-[#101816] hover:bg-[#dae7e3]"; 

    return (
        <div className='!fixed w-full h-full bg-black/60 z-50 inset-0 flex'>
            <div className="flex w-full h-full bg-white max-h-[85vh] max-w-[85vw] m-auto rounded-xl shadow-2xl overflow-hidden">
                <Canvas 
                    camera={{ position: ascarisCloseUp, fov: 45 }}
                    className="w-2/3 h-full"   
                    dpr={[1, 2]}
                >
                    <Model 
                        modelPath={modelPath} 
                        rotation={rotation}
                        isExpanded={isExpanded}
                        yOffset={yOffset} 
                        setIsExpanded={setIsExpanded}
                        setActivePart={setActivePart}
                        isXRayEnabled={isXRayEnabled}
                    />
                </Canvas>
                <div className="w-1/3 bg-white p-8 flex flex-col justify-center">
                    <h3 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                        {parasiteDetails.title}
                    </h3>
                    <p className="text-[#101816] text-base leading-normal font-normal">
                        {parasiteDetails.description}
                    </p>
                </div>
            </div>
            
            <button 
                className="absolute top-4 right-4 text-white text-3xl z-60 bg-black/50 rounded-full p-1 w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
                onClick={() => setIsExpanded(false)}
            >
                &times;
            </button>
            
            <button 
                className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-60 
                            flex items-center justify-center overflow-hidden rounded-lg h-10
                            text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 transition-colors 
                            ${xrayButtonClass}`}
                onClick={() => setIsXRayEnabled(!isXRayEnabled)}
            >
                {isXRayEnabled ? "Desactivar Rayos X" : "Activar Rayos X"}
            </button>
        </div>
    )
}

export default ExpandedModelCard;