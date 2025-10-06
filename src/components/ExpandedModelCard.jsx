import React, {useEffect, useState} from 'react'
import Model from './Model'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei';

const WebGLCleanup = ({modelPath}) => {
    const {gl} = useThree();

    useEffect(() => {
        return () => {
            gl.dispose();
            useGLTF.clear(modelPath);
        }
    }, [gl, modelPath]);

    return null;
};

function ExpandedModelCard({isExpanded, setIsExpanded, modelPath, rotation}) {

    const [activePart, setActivePart] = useState(null);

  return (
    <div className='!fixed w-full h-full bg-gray-500 z-50 inset-0'>
        <div className="flex w-full h-full">
            <Canvas 
                camera={{ position: [0, 0, 3], fov: 45 }}
                className="w-2/3 h-full"   
                dpr={[1,2]}
            >
                <WebGLCleanup modelPath={modelPath}/>
                <Model 
                    modelPath={modelPath} 
                    rotation={rotation}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                    setActivePart={setActivePart}
                />
            </Canvas>
            <div className="w-1/3 bg-gray-200"></div>
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