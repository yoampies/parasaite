import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './sections/Home';
import Scanner from './sections/Scanner';
import History from './sections/History';
import Library from './sections/Library';
import Settings from './sections/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/history" element={<History />} />
        <Route path="/library" element={<Library />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App