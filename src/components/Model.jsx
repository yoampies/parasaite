import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import React, { useRef, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame } from '@react-three/fiber';
import * as THREE from "three";

/**
 * @description Un componente auxiliar para cargar dinámicamente cualquier modelo GLTF
 * @param {object} props - Propiedades del componente.
 * @param {string} props.modelPath - La ruta al archivo de modelo 3D (.gltf o .glb).
 * @param {Array<number>} props.rotation - La rotación del modelo en el espacio 3D, en radianes [x, y, z].
 */

// Model.jsx

const DynamicModel = ({ modelPath, rotation, isExpanded, setIsExpanded, activePart, setActivePart, isXRayEnabled, setFocusPoint }) => {
    const { scene } = useGLTF(modelPath);
    const lastSelected = useRef();

    useEffect(() => {
      const opacity = isXRayEnabled ? 0.05 : 1;
      const color = isXRayEnabled ? "#000000" : "white";
      const transparent = opacity < 1 ? true : false;

      scene.traverse((child) => {
        if(child.isMesh){
          child.material.color.set(color);
          child.material.opacity = opacity;
          child.material.transparent = transparent;
          child.material.needsUpdate = true;
        }
      })
    }, [activePart, isXRayEnabled])

    const onPartSelect = (e) => {
        e.stopPropagation();

        if (isExpanded && !isXRayEnabled) {
            // Lógica de selección básica (cuando está en el ExpandedCard)
            setFocusPoint(e.point.toArray());

            if (lastSelected.current) {
                // Restauramos al color "original" (asumiendo que era blanco o similar)
                lastSelected.current.material.color.set('white'); 
            }
            e.object.material = e.object.material.clone();
            e.object.material.color.set('cyan');
            lastSelected.current = e.object;
            setActivePart(e.object.name);
        } else {
            // Lógica de expansión (cuando está en el ModelCanvas pequeño)
            setIsExpanded(true); 
        }
    };

    // Retornamos solo la primitiva con el onClick
    return (
    <>
      <primitive object={scene} rotation={rotation} onClick={onPartSelect} />
    </>
  )
};

/**
 * @description Componente principal para mostrar un modelo 3D interactivo en un lienzo.
 * Este componente maneja la carga, la visualización y los controles de órbita del modelo.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.modelPath - La ruta al archivo de modelo 3D (.gltf o .glb).
 * @param {Array<number>} props.rotation - La rotación del modelo en el espacio 3D, en radianes [x, y, z].
 */
function Model({ modelPath, rotation, isExpanded, setIsExpanded, activePart, setActivePart, isXRayEnabled, focusPoint, setFocusPoint, yOffset }) {
  
  const orbitRef = useRef();

  useFrame((state) => {
    if(orbitRef.current && Array.isArray(focusPoint) && modelPath.endsWith("A.glb")) {
      const targetPosition = new THREE.Vector3(...focusPoint);
      
      orbitRef.current.target.lerp(targetPosition, 0.1);

      orbitRef.current.update();
    }
  })

  return (
    <>
      {/* Luces para iluminar el modelo */}
      <ambientLight intensity={1} color="#fafafa" />
      <directionalLight position={[0, 0, 5]} intensity={7} />

      {/* Controles de órbita para la interacción del usuario */}
      <OrbitControls
        enablePan={false}
        maxDistance={5}
        minDistance={1}
        ref={orbitRef}
        target={[0, yOffset, 0]} 

      />

      {/* Renderiza el modelo solo si la ruta es válida */}
      {modelPath && <DynamicModel
                      modelPath={modelPath} 
                      rotation={rotation} 
                      isExpanded={isExpanded}
                      setIsExpanded={setIsExpanded}
                      activePart={activePart}
                      setActivePart={setActivePart}
                      isXRayEnabled={isXRayEnabled}
                      focusPoint={focusPoint}
                      setFocusPoint={setFocusPoint}
                    />
      }
    </>
  );  
}

// **Validación de Propiedades con PropTypes**
Model.propTypes = {
  modelPath: PropTypes.string.isRequired,
  rotation: PropTypes.arrayOf(PropTypes.number),
  isExpanded: PropTypes.bool,
  setIsExpanded: PropTypes.func.isRequired,
};

// **Propiedades por Defecto**
Model.defaultProps = {
  rotation: [0, 0, 0], // Rotación por defecto a 0 en todos los ejes
};

export default memo(Model);