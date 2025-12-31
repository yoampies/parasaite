import { Html } from '@react-three/drei';

/**
 * @description Componente de carga diseñado específicamente para ser utilizado 
 * como fallback dentro de un bloque Suspense en un entorno de React Three Fiber.
 */
const ModelLoader = () => {
  return (
    <Html fullscreen> 
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
        {/* Spinner animado con Tailwind CSS */}
        <div 
          className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-[#5e8d81]"
          role="status"
          aria-label="Cargando modelo 3D"
        ></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Cargando...</p>
      </div>
    </Html>
  );
};

export default ModelLoader;