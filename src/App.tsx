import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./sections/Home'));
const Scanner = lazy(() => import('./sections/Scanner'));
const ScannerResults = lazy(() => import('./sections/ScannerResults'));
const ScannerFeedback = lazy(() => import('./sections/ScannerFeedback'));
const History = lazy(() => import('./sections/History'));
const Library = lazy(() => import('./sections/Library'));
const ParasiteDetails = lazy(() => import('./sections/ParasiteDetails'));

// Componente de carga ligero
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#5e8d81] border-t-transparent"></div>
      <p className="font-inter text-lg font-medium text-[#5e8d81]">Cargando...</p>
    </div>
  </div>
);

/**
 * @description Punto de entrada principal de la aplicación.
 * Define la jerarquía de rutas y la navegación del sistema Parasite-Vision AI.
 */
const App = (): React.ReactElement => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Dashboard Epidemiológico */}
          <Route path="/" element={<Home />} />

          {/* Flujo de Diagnóstico por IA */}
          <Route path="/scanner" element={<Scanner />} />

          {/* Restaurada la ruta original que busca tu código */}
          <Route path="/scanner-results/:analysisId" element={<ScannerResults />} />

          {/* Restaurada la ruta de feedback que faltaba */}
          <Route path="/feedback/:analysisId" element={<ScannerFeedback />} />

          {/* Gestión de Historial y Datos */}
          <Route path="/history" element={<History />} />

          {/* Repositorio Educativo */}
          <Route path="/library" element={<Library />} />

          {/* Restaurado el parámetro original :parasiteName */}
          <Route path="/library/:parasiteName" element={<ParasiteDetails />} />

          {/* Fallback para rutas no encontradas (404) redirige a Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
