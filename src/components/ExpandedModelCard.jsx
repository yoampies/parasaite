import React, {useState, useEffect} from 'react'
import Model from './Model'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei';

function ExpandedModelCard({isExpanded, setIsExpanded, modelPath, rotation}) {

    const [activePart, setActivePart] = useState(null);

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
                camera={{ position: [0, 0, 3], fov: 45 }}
                className="w-2/3 h-full"   
                dpr={[1, 2]}
            >
                <Model 
                    modelPath={modelPath} 
                    rotation={rotation}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                    setActivePart={setActivePart}
                />
            </Canvas>
            <div className="w-1/3 bg-gray-200">
                La parte seleccionada es: {activePart}. El modelPath es {modelPath}
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