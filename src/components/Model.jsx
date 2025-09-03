import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * @description Un componente auxiliar para cargar dinámicamente cualquier modelo GLTF
 * @param {object} props - Propiedades del componente.
 * @param {string} props.modelPath - La ruta al archivo de modelo 3D (.gltf o .glb).
 * @param {Array<number>} props.rotation - La rotación del modelo en el espacio 3D, en radianes [x, y, z].
 */
const DynamicModel = ({ modelPath, rotation }) => {
  // `useGLTF` carga el archivo GLB desde la ruta proporcionada.
  const { scene } = useGLTF(modelPath);

  // Renderiza la escena del modelo 3D.
  // El tag <primitive> permite renderizar objetos 3D directamente.
  return <primitive object={scene} rotation={rotation} />;
};

/**
 * @description Componente principal para mostrar un modelo 3D interactivo en un lienzo.
 * Este componente maneja la carga, la visualización y los controles de órbita del modelo.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.modelPath - La ruta al archivo de modelo 3D (.gltf o .glb).
 * @param {Array<number>} props.rotation - La rotación del modelo en el espacio 3D, en radianes [x, y, z].
 */
function Model({ modelPath, rotation }) {
  // Pre-carga el modelo para una experiencia de usuario más fluida.
  // Es una buena práctica llamar a esto aquí para que React se encargue de la gestión del caché.
  useGLTF.preload(modelPath);

  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
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
      {modelPath && <DynamicModel modelPath={modelPath} rotation={rotation} />}
    </Canvas>
  );
}

// **Validación de Propiedades con PropTypes**
Model.propTypes = {
  modelPath: PropTypes.string.isRequired,
  rotation: PropTypes.arrayOf(PropTypes.number),
};

// **Propiedades por Defecto**
Model.defaultProps = {
  rotation: [0, 0, 0], // Rotación por defecto a 0 en todos los ejes
};

export default Model;