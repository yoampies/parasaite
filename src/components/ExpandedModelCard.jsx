import React from 'react'
import Model from './Model'
import { Canvas } from '@react-three/fiber'

function ExpandedModelCard({isExpanded, setIsExpanded, modelPath, rotation}) {
  return (
    <div className='!fixed w-full h-full bg-gray-300/95 z-50 inset-0'>
        <button 
            className="absolute top-4 left-4 text-white text-3xl z-50"
            onClick={() => setIsExpanded(false)}
        >
            &times;
        </button>
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
            <Model 
                modelPath={modelPath} 
                rotation={rotation}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}    
            />
        </Canvas>
    </div>
  )
}

export default ExpandedModelCard