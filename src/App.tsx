// src/App.tsx - Estructura corregida con Navbar y contenedor global
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Importamos tu Navbar estática
import Home from './sections/Home';
import Scanner from './sections/Scanner';
import ScannerResults from './sections/ScannerResults';
import ScannerFeedback from './sections/ScannerFeedback';

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
  return (
    <BrowserRouter>
      {/* 1. La Navbar se renderiza fija arriba para toda la aplicación */}
      <Navbar />

      {/* 2. Contenedor global con márgenes simétricos idénticos a la sección Home */}
      <main className="bg-white min-h-[calc(100vh-64px)] overflow-hidden">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/scanner-results/:analysisId" element={<ScannerResults />} />
            <Route path="/feedback/:analysisId" element={<ScannerFeedback />} />
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
