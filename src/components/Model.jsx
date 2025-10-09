import { OrbitControls, useGLTF } from '@react-three/drei';
import React, { useRef, memo } from 'react';
import PropTypes from 'prop-types';

/**
 * @description Un componente auxiliar para cargar dinámicamente cualquier modelo GLTF
 * @param {object} props - Propiedades del componente.
 * @param {string} props.modelPath - La ruta al archivo de modelo 3D (.gltf o .glb).
 * @param {Array<number>} props.rotation - La rotación del modelo en el espacio 3D, en radianes [x, y, z].
 */

// Model.jsx

const DynamicModel = ({ modelPath, rotation, isExpanded, setIsExpanded, setActivePart }) => {
    const { scene } = useGLTF(modelPath);
    const lastSelected = useRef();

    const onPartSelect = (e) => {
        e.stopPropagation();

        if (isExpanded) {
            // Lógica de selección básica (cuando está en el ExpandedCard)
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
    return <primitive object={scene} rotation={rotation} onClick={onPartSelect} />;
};

/**
 * @description Componente principal para mostrar un modelo 3D interactivo en un lienzo.
 * Este componente maneja la carga, la visualización y los controles de órbita del modelo.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.modelPath - La ruta al archivo de modelo 3D (.gltf o .glb).
 * @param {Array<number>} props.rotation - La rotación del modelo en el espacio 3D, en radianes [x, y, z].
 */
function Model({ modelPath, rotation, isExpanded, setIsExpanded, activePart, setActivePart, yOffset = 0 }) {
  // Pre-carga el modelo para una experiencia de usuario más fluida.
  // Es una buena práctica llamar a esto aquí para que React se encargue de la gestión del caché.

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