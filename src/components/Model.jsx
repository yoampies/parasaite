import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import React, { useRef, memo, useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import { useFrame } from '@react-three/fiber';
import * as THREE from "three";
import ModelLoader from "./ModelLoader.jsx"

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

    // Almacenamos el estado original del material y el target de la animación.
    const materialRefs = useRef({}); 
    // Inicializamos el target en el estado 'normal' (opacidad 1, color blanco)
    const animationTarget = useRef({ opacity: 1, color: new THREE.Color('white') });

    // Se ejecuta cada vez que isXRayEnabled cambia.
    useEffect(() => {
        // Define los valores objetivo para la transición
        const targetOpacity = isXRayEnabled ? 0.05 : 1;
        const targetColor = isXRayEnabled ? new THREE.Color('#000000') : new THREE.Color('white');
        
        // Almacena el target en la referencia
        animationTarget.current.opacity = targetOpacity;
        animationTarget.current.color.copy(targetColor);

        // Si los materiales aún no están inicializados (solo la primera vez), haz la copia inicial
        if (Object.keys(materialRefs.current).length === 0) {
            scene.traverse((child) => {
                if (child.isMesh) {
                    // Copiamos y almacenamos referencias para trabajar con ellos en useFrame
                    materialRefs.current[child.uuid] = {
                        originalColor: child.material.color.clone(),
                        originalOpacity: child.material.opacity,
                    };
                    child.material.transparent = true; // Fundamental para que opacity < 1 funcione
                    child.material.needsUpdate = true;
                }
            });
        }
    }, [isXRayEnabled, scene]); // Depende solo de si el modo Rayos X está activo

    // state = información de Three.js (cámara, tiempo, etc.), delta = tiempo desde el último fotograma
    useFrame((state, delta) => {
        // Usamos delta para hacer la animación independiente de la velocidad de fotogramas (FPS)
        // 5 es la velocidad de transición (más alto = más rápido)
        const speed = 5 * delta; 
        
        scene.traverse((child) => {
            if (child.isMesh && materialRefs.current[child.uuid]) {
                const material = child.material;
                const ref = materialRefs.current[child.uuid]; // Acceso a nuestra referencia
                const target = animationTarget.current;
                
                // Si hay un color de anulación (override), lo usamos inmediatamente.
                const finalTargetColor = ref.overrideColor || target.color; 
                
                // Interpolación (LERP) del color: usa finalTargetColor
                material.color.lerp(finalTargetColor, speed); 
                
                // Interpolación de la opacidad (esto sigue igual)
                material.opacity = THREE.MathUtils.lerp(material.opacity, target.opacity, speed);
                
                material.needsUpdate = true;
            }
        });
    })

    const onPartSelect = (e) => {
        e.stopPropagation();

        if (isExpanded && !isXRayEnabled) {
            // ... (lógica existente para setFocusPoint)

            // --- 1. Restaurar el anterior (si existe) ---
            if (lastSelected.current) {
                // Remove the override color so it goes back to animating
                materialRefs.current[lastSelected.current.uuid].overrideColor = null; 
            }

            // --- 2. Aplicar el nuevo color y establecer el override ---
            e.object.material = e.object.material.clone();
            e.object.material.color.set('cyan');
            
            // ✨ Almacena el color de anulación (cyan)
            materialRefs.current[e.object.uuid].overrideColor = new THREE.Color('cyan');
            
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
      {/* Luces y OrbitControls se quedan fuera de Suspense */}
      <ambientLight intensity={1} color="#fafafa" />
      <directionalLight position={[0, 0, 5]} intensity={7} />
      <OrbitControls
        enablePan={false}
        maxDistance={5}
        minDistance={1}
        ref={orbitRef}
        target={[0, yOffset, 0]} 
      />

      {/* 2. Envuelve tu modelo con Suspense */}
      <Suspense fallback={<ModelLoader />}>
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
        />}
      </Suspense>
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