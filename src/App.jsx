// src/app.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './sections/Home';
import Scanner from './sections/Scanner';
import ScannerResults from './sections/ScannerResults';
import ScannerFeedback from './sections/ScannerFeedback';
import History from './sections/History';
import Library from './sections/Library';
import Settings from './sections/Settings';
import ParasiteDetails from './sections/ParasiteDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/scanner-results/:analysisId" element={<ScannerResults />} />
        <Route path="/feedback/:analysisId" element={<ScannerFeedback />} />
        <Route path="/history" element={<History />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:parasiteName" element={<ParasiteDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;