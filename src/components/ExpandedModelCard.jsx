import React, {useState, useEffect} from 'react'
import Model from './Model'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei';
import { model_mesh_details } from '../assets/constants';

function ExpandedModelCard({isExpanded, setIsExpanded, modelPath, rotation}) {

    const [activePart, setActivePart] = useState(null);
    const ascarisCloseUp = modelPath === "/models/ascaris-lumbricoides_A.glb" ? [0, 0.5, 1] : [0, 0, 3];
    const yOffset = modelPath === "/models/ascaris-lumbricoides_A.glb" ? 0.3 : 0;
    const parts = modelPath.split("/");
    const filename = parts.pop();
    const fullModelSlug = filename.replace(".glb", "");
    const parasiteData = model_mesh_details[fullModelSlug];
    const parasiteDetails = parasiteData?.[activePart] || parasiteData?.["DEFAULT"]
    
    useEffect(() => {
        return () => {
            // Limpia el caché GLTF global cuando el canvas pequeño se desmonta
            useGLTF.clear(modelPath); 
        };
    }, [modelPath]);

  return (
    <div className='!fixed w-full h-full bg-gray-500 z-50 inset-0'>
        <div className="flex w-full h-full">
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
                    />
            </Canvas>
            <div className="w-1/3 bg-gray-200">
                {parasiteDetails.title} <br />
                {parasiteDetails.description}
            </div>
        </div>
        <button 
            className="absolute top-4 left-4 text-white text-3xl z-60"
            onClick={() => setIsExpanded(false)}
        >
            &times;
        </button>
    </div>
  )
}

export default ExpandedModelCard;