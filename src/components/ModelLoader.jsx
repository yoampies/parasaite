import React from 'react';
import { Html } from '@react-three/drei';

const ModelLoader = () => {
  return (
    // Usa 'fullscreen' para ocupar todo el viewport del Canvas
    // y luego centra el contenido con flexbox dentro de ese Html.
    // También puedes usar 'wrapper' y darle width/height al div interno.
    <Html fullscreen> 
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
        {/* Un spinner simple hecho con CSS */}
        <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-[#5e8d81]"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Cargando...</p>
      </div>
    </Html>
  );
};

export default ModelLoader;