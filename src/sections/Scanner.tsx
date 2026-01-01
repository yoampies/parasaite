import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Components
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import ImageUploader from '../components/ImageUploader';

// Hooks & Store
import { useHistoryStore } from '../hooks/UseHistoryStore';
import useImageAnalysisWorker from '../hooks/UseImageAnalysisWorker';

// Constants & Types
import { possibleParasites } from '../assets/constants';
import { IAnalysis, IDetectedParasite } from '../types';

/**
 * @description Genera datos simulados para la demo (en producción vendría del backend)
 */
const generateRandomParasites = (): IDetectedParasite[] => {
  const parasites: IDetectedParasite[] = [];
  const numberOfParasites = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < numberOfParasites; i++) {
    const randomParasite = possibleParasites[Math.floor(Math.random() * possibleParasites.length)];
    const randomValue = Math.floor(Math.random() * 20) + 80;
    parasites.push({ label: randomParasite, value: randomValue });
  }
  return parasites;
};

const generateContent = (detectedParasites: IDetectedParasite[]): string => {
  if (detectedParasites.length > 0) {
    const names = detectedParasites.map((p) => p.label).join(', ');
    return `Detectado: ${names}`;
  }
  return 'Sin hallazgos significativos.';
};

function Scanner() {
  const navigate = useNavigate();

  // 1. Estado Global (Zustand) y Local
  const { analyses, addAnalysis } = useHistoryStore();
  const [selectedImage, setSelectedImage] = useState<IAnalysis | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 2. Referencias para el Worker y UI
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  // 3. Hook del Worker (Controla la magia del OffscreenCanvas)
  const { isLoading } = useImageAnalysisWorker(
    imageLoaded,
    selectedImage,
    imgRef,
    canvasRef,
    progressBarRef,
    scannerContainerRef
  );

  const selectedFileName = useMemo(() => {
    return selectedImage?.fileName || 'Nueva Muestra';
  }, [selectedImage]);

  // 4. Manejador de Carga de Imagen
  const handleUploadedImage = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Image = e.target?.result as string;
      const randomResults = generateRandomParasites();

      const newAnalysis: IAnalysis = {
        id: uuidv4(),
        imgURL: base64Image,
        date: new Date().toLocaleString(),
        fileName: file.name,
        detectedParasites: randomResults,
        content: generateContent(randomResults),
      };

      // Guardamos en Zustand y seleccionamos
      addAnalysis(newAnalysis);
      setSelectedImage(newAnalysis);
      setImageLoaded(false); // Reset para disparar el evento onLoad de la imagen
    };

    reader.readAsDataURL(file);
  };

  const handleImageSelect = (analysis: IAnalysis) => {
    setSelectedImage(analysis);
    setImageLoaded(false);
  };

  const handleAnalyzeClick = () => {
    if (selectedImage) {
      navigate(`/scanner-results/${selectedImage.id}`, { state: { analysis: selectedImage } });
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />

        <main className="px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 gap-6">
            <header className="flex flex-wrap justify-between gap-3 p-4">
              <h1 className="text-[#101816] tracking-light text-[32px] font-bold leading-tight">
                Escáner Microbiológico
              </h1>
            </header>

            {/* AREA DE ESCANEO ACTIVO */}
            <section
              ref={scannerContainerRef}
              className="relative w-full min-h-[400px] bg-[#f0f5f4] rounded-xl overflow-hidden border-2 border-dashed border-[#5e8d81] flex flex-col items-center justify-center transition-transform"
            >
              {!selectedImage ? (
                <div className="p-8 w-full">
                  <ImageUploader
                    instruction="Sube una muestra para iniciar el análisis IA"
                    message="El Web Worker procesará la imagen en segundo plano"
                    typesOfFiles="JPG, PNG"
                    selectedFileName={selectedFileName}
                    onFileSelect={handleUploadedImage}
                  />
                </div>
              ) : (
                <div className="relative w-full h-full flex flex-col items-center">
                  {/* Barra de Progreso */}
                  <div className="w-full h-1 bg-gray-200 absolute top-0 left-0 z-20">
                    <div
                      ref={progressBarRef}
                      className="h-full bg-[#00c795] w-0 transition-all ease-out"
                    />
                  </div>

                  {/* Contenedor de Imagen y Canvas superpuesto */}
                  <div className="relative max-w-full max-h-[500px] mt-4">
                    <img
                      ref={imgRef}
                      src={selectedImage.imgURL}
                      alt="Microscopía"
                      className="max-h-[500px] object-contain rounded-lg shadow-lg"
                      onLoad={() => setImageLoaded(true)}
                    />
                    {/* El Canvas está posicionado absolutamente sobre la imagen */}
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    />
                  </div>

                  <div className="p-4 flex gap-4">
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="text-[#5e8d81] font-medium hover:underline"
                    >
                      Cambiar Imagen
                    </button>
                    <p className="text-sm text-gray-500 italic py-1">
                      {isLoading
                        ? 'El Web Worker está segmentando parásitos...'
                        : 'Segmentación completada.'}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Galería de muestras recientes (Desde Zustand) */}
            <section aria-labelledby="recent-images-title">
              <h2
                id="recent-images-title"
                className="text-[#101816] text-[22px] font-bold px-4 pb-3"
              >
                Muestras Recientes
              </h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                {analyses.slice(0, 5).map((analysis) => (
                  <Card
                    key={analysis.id}
                    imgURL={analysis.imgURL}
                    onClick={() => handleImageSelect(analysis)}
                    isSelected={selectedImage?.id === analysis.id}
                  />
                ))}
              </div>
            </section>

            {/* Footer de Acción */}
            <footer className="flex px-4 py-3 justify-end sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-100">
              <button
                type="button"
                className={`flex min-w-[120px] items-center justify-center rounded-lg h-12 px-6 text-sm font-bold transition-all shadow-md
                  ${
                    selectedImage && !isLoading
                      ? 'bg-[#00c795] text-[#101816] hover:bg-[#00a67d] cursor-pointer'
                      : 'bg-[#f0f5f4] text-gray-400 cursor-not-allowed'
                  }`}
                onClick={handleAnalyzeClick}
                disabled={!selectedImage || isLoading}
              >
                {isLoading ? 'Procesando...' : 'Ver Resultados Detallados'}
              </button>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Scanner;
