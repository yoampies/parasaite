import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'; // Para la limpieza de caché
import Model from './Model'; // Asegúrate de que la ruta sea correcta

// Componente principal que contiene el Canvas del modelo pequeño
function ModelCanvas({ modelPath, rotation, scrollPositionRef, setIsExpanded, setExpandedModelPath}) {
    useEffect(() => {
        return () => {
            // Limpia el caché GLTF global cuando el canvas pequeño se desmonta
            useGLTF.clear(modelPath); 
        };
    }, [modelPath]);

    const ascarisCloseUp = modelPath === "/models/ascaris-lumbricoides_A.glb" ? [0, 0.5, 1] : [0, 0, 3];
    const yOffset = modelPath === "/models/ascaris-lumbricoides_A.glb" ? 0.3 : 0;

    return (
        <div className="w-full h-[500px] p-4">
            <Canvas 
                camera={{ position: ascarisCloseUp, fov: 45 }}
                dpr={[1, 2]}    
            >
                {/* Añadir la limpieza DENTRO del Canvas */}
                <Model 
                    modelPath={modelPath} 
                    rotation={rotation}
                    isExpanded={false}
                    yOffset={yOffset} 
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