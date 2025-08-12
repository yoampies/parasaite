import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import React from 'react';

// A helper component to dynamically load any GLTF model
const DynamicModel = ({ modelPath }) => {
  // `useGLTF` loads the GLB file from the path you pass in
  const { scene } = useGLTF(modelPath);
  
  // Render the 3D model's scene.
  // The <primitive> tag allows you to render 3D objects directly.
  return <primitive object={scene} />;
};

function Model({ modelPath }) {
  // Preload the model if the path exists.
  if (modelPath) {
    useGLTF.preload(modelPath);
  }

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.2} color="#1a1a40" />
      <directionalLight position={[5, 5, 5]} intensity={5} />

      <OrbitControls
        enablePan={false}
        maxDistance={5}
        minDistance={1}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
      />

      {/* Only render the model if a valid path has been passed */}
      {modelPath ? <DynamicModel modelPath={modelPath} /> : null}
    </Canvas>
  );
}

export default Model;