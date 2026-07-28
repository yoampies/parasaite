// src/App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './sections/Home';
import Scanner from './sections/Scanner';
import ScannerResults from './sections/ScannerResults';
import { useNetworkSync } from './hooks/UseNetworkSync';

const History = lazy(() => import('./sections/History'));
const Library = lazy(() => import('./sections/Library'));
const ParasiteDetails = lazy(() => import('./sections/ParasiteDetails'));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#5e8d81] border-t-transparent"></div>
      <p className="font-inter text-lg font-medium text-[#5e8d81]">Cargando...</p>
    </div>
  </div>
);

const App = (): React.ReactElement => {
  const isOnline = useNetworkSync();

  return (
    <BrowserRouter>
      {/* 1. La Navbar se renderiza fija arriba para toda la aplicación */}
      <Navbar />

      {/* 2. Contenedor global con márgenes simétricos idénticos a la sección Home */}
      <main className="bg-white min-h-[calc(100vh-64px)] overflow-hidden">
        <Suspense fallback={<PageLoader />}>
          {!isOnline && (
            <div className="bg-amber-600 text-white text-xs font-semibold text-center py-1.5 px-4 sticky top-0 z-50 shadow-md">
              Modo offline: Las capturas y diagnósticos se guardan localmente y se sincronizarán al
              recuperar la conexión.
            </div>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/results/:analysisId" element={<ScannerResults />} />
            <Route path="/history" element={<History />} />
            <Route path="/library" element={<Library />} />
            <Route path="/library/:parasiteName" element={<ParasiteDetails />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
};

export default App;
