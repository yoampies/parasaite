import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'; // Para la limpieza de caché
import Model from './Model'; // Asegúrate de que la ruta sea correcta
import WebGLCleanup from './WebGLCleanup';

// Componente principal que contiene el Canvas del modelo pequeño
function ModelCanvas({ modelPath, rotation, scrollPositionRef, setIsExpanded, setExpandedModelPath}) {
    return (
        <div className="w-full h-[500px] p-4">
            <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                {/* Añadir la limpieza DENTRO del Canvas */}
                <WebGLCleanup modelPath={modelPath} /> 
                <Model 
                    modelPath={modelPath} 
                    rotation={rotation}
                    setIsExpanded={() => {
                        scrollPositionRef.current = window.scrollY;
                        setIsExpanded(true);
                        setExpandedModelPath(modelPath);
                    }}
                />
            </Canvas>
        </div>
    );
}

export default ModelCanvas;