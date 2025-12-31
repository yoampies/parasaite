import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

// Components
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import ImageUploader from "../components/ImageUploader";

// Constants, Data & Types
import { 
  recentImages as recentImagesConstant, 
  recentAnalyses as recentAnalysesConstant, 
  possibleParasites as possibleParasitesConstant 
} from "../assets/constants";
import { IAnalysis, IDetectedParasite } from "../types";

/**
 * @description Simula el motor de detección de la IA generando resultados aleatorios.
 */
const generateRandomParasites = (): IDetectedParasite[] => {
  const parasites: IDetectedParasite[] = [];
  const numberOfParasites = Math.floor(Math.random() * 5) + 1;

  for (let i = 0; i < numberOfParasites; i++) {
    const randomParasite = possibleParasitesConstant[Math.floor(Math.random() * possibleParasitesConstant.length)];
    const randomValue = Math.floor(Math.random() * 50) + 50;
    parasites.push({ label: randomParasite, value: randomValue });
  }
  return parasites;
};

/**
 * @description Genera un resumen textual basado en los hallazgos.
 */
const generateContent = (detectedParasites: IDetectedParasite[]): string => {
  if (detectedParasites.length > 0) {
    const firstParasite = detectedParasites[0];
    return `Detectado: ${firstParasite.label}, Confianza: ${firstParasite.value}%`;
  }
  return 'Detectado: No se encontraron estructuras parasitarias compatibles.';
};

/**
 * @description Página del Escáner.
 * Gestiona la carga de muestras (imágenes) y el acceso a análisis previos almacenados localmente.
 */
function Scanner() {
  const [selectedImage, setSelectedImage] = useState<IAnalysis | null>(null);
  const [displayAnalyses, setDisplayAnalyses] = useState<IAnalysis[]>([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const stored = localStorage.getItem('recentAnalyses');
    const storedAnalyses: IAnalysis[] | null = stored ? JSON.parse(stored) : null;
    
    // Inicialización del almacenamiento local con datos de prueba si está vacío
    if (!storedAnalyses || storedAnalyses.length === 0) {
      const combinedInitialData = [...recentAnalysesConstant, ...recentImagesConstant];
      
      const initialAnalyses: IAnalysis[] = combinedInitialData.map(analysis => ({
        ...analysis,
        id: analysis.id || uuidv4(),
        detectedParasites: analysis.detectedParasites || [],
      })) as IAnalysis[];
      
      localStorage.setItem('recentAnalyses', JSON.stringify(initialAnalyses));
      setDisplayAnalyses(initialAnalyses);
    } else {
      setDisplayAnalyses(storedAnalyses);
    }
  }, []);

  // Memorización del nombre del archivo para evitar recálculos en re-renders visuales
  const selectedFileName = useMemo<string | null>(() => {
    if (!selectedImage) return null;
    return selectedImage.fileName || selectedImage.imgURL.split('/').pop() || "Imagen seleccionada";
  }, [selectedImage]);

  /**
   * @description Procesa el archivo cargado, lo convierte a Base64 y crea una nueva entrada de análisis.
   */
  const handleUploadedImage = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const base64Image = e.target?.result as string;
      
      const randomResults = generateRandomParasites();
      
      const newAnalysis: IAnalysis = {
        id: uuidv4(),
        imgURL: base64Image,
        date: new Date().toISOString().split('T')[0],
        fileName: file.name,
        detectedParasites: randomResults,
        content: generateContent(randomResults),
      };
      
      const updatedAnalyses = [...displayAnalyses, newAnalysis];
      localStorage.setItem('recentAnalyses', JSON.stringify(updatedAnalyses));
      setDisplayAnalyses(updatedAnalyses);
      setSelectedImage(newAnalysis);
    };

    reader.readAsDataURL(file);
  };
  
  const handleImageSelect = (analysis: IAnalysis) => {
    setSelectedImage(analysis);
  };

  const handleAnalyze = () => {
    if (selectedImage) {
      navigate(`/scanner-results/${selectedImage.id}`, { state: { analysis: selectedImage } });
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        
        <main className="px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            
            <header className="flex flex-wrap justify-between gap-3 p-4">
              <h1 className="text-[#101816] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Escáner Microbiológico
              </h1>
            </header>
            
            {/* Componente de carga de imágenes */}
            <ImageUploader 
              instruction="Arrastra y suelta imágenes de microscopía aquí o haz clic para subir" 
              message="Formatos admitidos:" 
              typesOfFiles="JPG, PNG, TIFF" 
              selectedFileName={selectedFileName}
              onFileSelect={handleUploadedImage}
            />
            
            {/* Galería de muestras recientes */}
            <section aria-labelledby="recent-images-title">
              <h2 
                id="recent-images-title" 
                className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
              >
                Muestras Recientes
              </h2>
              
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                {displayAnalyses.map((analysis) => (
                  <Card 
                    key={analysis.id} 
                    imgURL={analysis.imgURL} 
                    onClick={() => handleImageSelect(analysis)}
                    isSelected={selectedImage?.id === analysis.id}
                  />
                ))}
              </div>
            </section>
            
            {/* Acción de Procesamiento */}
            <footer className="flex px-4 py-3 justify-end sticky bottom-0 bg-white/80 backdrop-blur-sm">
              <button 
                type="button"
                className={`flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 text-sm font-bold transition-all 
                  ${selectedImage 
                    ? "bg-[#00c795] text-[#101816] hover:bg-[#00a67d]" 
                    : "bg-[#f0f5f4] text-gray-400 cursor-not-allowed"}`}
                onClick={handleAnalyze}
                disabled={!selectedImage}
              >
                Analizar Muestra
              </button>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Scanner;