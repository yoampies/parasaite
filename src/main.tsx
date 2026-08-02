import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { registerSW } from 'virtual:pwa-register';
import './styles/print.css';

registerSW({ immediate: true });

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    "Error crítico: No se encontró el contenedor 'root' en el DOM. " +
      "Asegúrate de que el archivo index.html tenga un <div id='root'></div>"
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
