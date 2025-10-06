import { OrbitControls, useGLTF, useCursor } from '@react-three/drei';
import React, {useState, useMemo, memo} from 'react';
import PropTypes from 'prop-types';
import * as THREE from "three"

/**
 * @description Un componente auxiliar para cargar dinámicamente cualquier modelo GLTF
 * @param {object} props - Propiedades del componente.
 * @param {string} props.modelPath - La ruta al archivo de modelo 3D (.gltf o .glb).
 * @param {Array<number>} props.rotation - La rotación del modelo en el espacio 3D, en radianes [x, y, z].
 */

const DynamicModel = ({ modelPath, rotation, isExpanded, setIsExpanded, activePart, setActivePart }) => {
  // `useGLTF` carga el archivo GLB desde la ruta proporcionada.
  const { scene } = useGLTF(modelPath);

  const onPartSelect = (e) => {
    if(isExpanded) {
      e.stopPropagation();
      setActivePart(e.object.name)
      console.log(e.object.name);
    } else {
      e.stopPropagation();
      setIsExpanded(true);
    }
  }

  return <primitive 
          object={scene} 
          rotation={rotation}
          onClick={(e) => onPartSelect(e)}
        />;
};

/**
 * @description Componente principal para mostrar un modelo 3D interactivo en un lienzo.
 * Este componente maneja la carga, la visualización y los controles de órbita del modelo.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.modelPath - La ruta al archivo de modelo 3D (.gltf o .glb).
 * @param {Array<number>} props.rotation - La rotación del modelo en el espacio 3D, en radianes [x, y, z].
 */
function Model({ modelPath, rotation, isExpanded, setIsExpanded, activePart, setActivePart }) {
  // Pre-carga el modelo para una experiencia de usuario más fluida.
  // Es una buena práctica llamar a esto aquí para que React se encargue de la gestión del caché.
  useGLTF.preload(modelPath);

  return (
    <>
      {/* Luces para iluminar el modelo */}
      <ambientLight intensity={1} color="#1a1a40" />
      <directionalLight position={[0, 0, 5]} intensity={5} />

      {/* Controles de órbita para la interacción del usuario */}
      <OrbitControls
        enablePan={false}
        maxDistance={5}
        minDistance={1}
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