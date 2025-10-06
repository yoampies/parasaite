import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'; // Para la limpieza de caché
import Model from './Model'; // Asegúrate de que la ruta sea correcta

// Componente para la limpieza forzada al desmontar
const Cleanup = ({ modelPath }) => {
    const { gl } = useThree();
    
    useEffect(() => {
        return () => {
            gl.dispose();
            useGLTF.clear(modelPath);
        };
    }, [gl, modelPath]);

    return null;
};

// Componente principal que contiene el Canvas del modelo pequeño
function ModelCanvas({ modelPath, rotation, scrollPositionRef, setIsExpanded, setExpandedModelPath}) {
    return (
        <div className="w-full h-[500px] p-4">
            <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                {/* Añadir la limpieza DENTRO del Canvas */}
                <Cleanup modelPath={modelPath} /> 
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