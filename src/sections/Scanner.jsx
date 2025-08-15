// Scanner.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import ImageUploader from "../components/ImageUploader";
import { recentImages as recentImagesConstant } from "../assets/constants";
import { v4 as uuidv4 } from 'uuid';

function Scanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayImages, setDisplayImages] = useState([]);
  const navigate = useNavigate(); 

  // 🟢 Este useEffect se encarga de sincronizar los datos de las constantes con localStorage
  useEffect(() => {
    const storedAnalyses = JSON.parse(localStorage.getItem('recentAnalyses')) || [];
    
    // Filtramos las imágenes de la constante para evitar duplicados en localStorage
    const newImagesToAdd = recentImagesConstant.filter(
      (constantImage) =>
        !storedAnalyses.some((storedAnalysis) => storedAnalysis.id === constantImage.id)
    );
    
    // Combinamos las imágenes de la constante con las de localStorage
    // Aseguramos que la estructura de los objetos de la constante sea la misma que la de localStorage
    const updatedAnalyses = [...newImagesToAdd, ...storedAnalyses];
    
    localStorage.setItem('recentAnalyses', JSON.stringify(updatedAnalyses));
    
  }, []); // Se ejecuta solo una vez al cargar el componente

  // 🟢 Este useEffect ahora se encarga solo de mostrar las imágenes en la interfaz de Scanner
  useEffect(() => {
    const storedAnalyses = JSON.parse(localStorage.getItem('recentAnalyses')) || [];
    setDisplayImages(storedAnalyses);
  }, []);

  const handleImageSelect = (analysis) => {
    setSelectedImage(analysis);
  };
  
  const selectedFileName = selectedImage ? (selectedImage.fileName || selectedImage.imgURL.split('/').pop()) : null;

  const handleUploadedImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      const newAnalysis = {
        id: uuidv4(),
        imgURL: base64Image,
        date: new Date().toISOString().split('T')[0],
        fileName: file.name,
        detectedParasites: [],
      };
      setSelectedImage(newAnalysis);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (selectedImage) {
      navigate(`/scanner-results/${selectedImage.id}`, { state: { analysis: selectedImage } });
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight min-w-72">Escáner</p>
            </div>
            <ImageUploader 
              instruction="Arrastra y suelta imágenes aquí o haz clic para subir" 
              message="Formatos de archivo admitidos:" 
              typesOfFiles="JPG, PNG, TIFF" 
              selectedFileName={selectedFileName}
              onFileSelect={handleUploadedImage}
            />
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Imágenes recientes</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {displayImages.map((analysis) => (
                <Card 
                  key={analysis.id} 
                  imgURL={analysis.imgURL} 
                  onClick={() => handleImageSelect(analysis)}
                  isSelected={selectedImage && selectedImage.id === analysis.id}
                />
              ))}
            </div>
            <div className="flex px-4 py-3 justify-end">
              <button 
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#00c795] text-[#101816] text-sm font-bold leading-normal tracking-[0.015em]"
                onClick={handleAnalyze}
                disabled={!selectedImage}
              >
                <span className="truncate">Analizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;