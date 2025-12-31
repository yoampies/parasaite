import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Secciones / Páginas
import Home from './sections/Home';
import Scanner from './sections/Scanner';
import ScannerResults from './sections/ScannerResults';
import ScannerFeedback from './sections/ScannerFeedback';
import History from './sections/History';
import Library from './sections/Library';
import ParasiteDetails from './sections/ParasiteDetails';

/**
 * @description Punto de entrada principal de la aplicación.
 * Define la jerarquía de rutas y la navegación del sistema Parasite-Vision AI.
 */
const App = (): React.ReactElement => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard Epidemiológico */}
        <Route path="/" element={<Home />} />
        
        {/* Flujo de Diagnóstico por IA */}
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/scanner-results/:analysisId" element={<ScannerResults />} />
        <Route path="/feedback/:analysisId" element={<ScannerFeedback />} />
        
        {/* Gestión de Historial y Datos */}
        <Route path="/history" element={<History />} />
        
        {/* Repositorio Educativo */}
        <Route path="/library" element={<Library />} />
        <Route path="/library/:parasiteName" element={<ParasiteDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;