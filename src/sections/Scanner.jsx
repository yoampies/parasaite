// Scanner.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import ImageUploader from "../components/ImageUploader";
import { recentImages as recentImagesConstant, recentAnalyses as recentAnalysesConstant, possibleParasites as possibleParasitesConstant } from "../assets/constants";
import { v4 as uuidv4 } from 'uuid';

const generateRandomParasites = () => {
    const parasites = [];
    const numberOfParasites = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < numberOfParasites; i++) {
        const randomParasite = possibleParasitesConstant[Math.floor(Math.random() * possibleParasitesConstant.length)];
        const randomValue = Math.floor(Math.random() * 50) + 50;
        
        parasites.push({ label: randomParasite, value: randomValue });
    }
    return parasites;
};

// Function to generate the content string for the card
const generateContent = (detectedParasites) => {
  if (detectedParasites.length > 0) {
    const firstParasite = detectedParasites[0];
    const parasiteName = firstParasite.label;
    const confidence = firstParasite.value;
    return `Detectado: ${parasiteName} (1), Confianza: ${confidence}%`;
  }
  return 'Detectado: No se encontraron parásitos';
};


function Scanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayImages, setDisplayImages] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    let storedAnalyses = JSON.parse(localStorage.getItem('recentAnalyses'));
    
    // 🚨 Corrected Logic: Initialize localStorage with combined, consistent data
    if (!storedAnalyses || storedAnalyses.length === 0) {
      // Combines both constant arrays which now have 'content'
      const combinedConstants = [...recentAnalysesConstant, ...recentImagesConstant];
      
      const initialAnalyses = combinedConstants.map(analysis => ({
        ...analysis,
        id: uuidv4(),
      }));
      localStorage.setItem('recentAnalyses', JSON.stringify(initialAnalyses));
      storedAnalyses = initialAnalyses;
    }
    
    setDisplayImages(storedAnalyses);
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleImageSelect = (analysis) => {
    setSelectedImage(analysis);
  };
  
  const selectedFileName = selectedImage ? (selectedImage.fileName || selectedImage.imgURL.split('/').pop()) : null;

  const handleUploadedImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];
      const formattedTime = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit'
      });

      const detectedParasites = generateRandomParasites();
      const contentString = generateContent(detectedParasites);

      const newAnalysis = {
        id: uuidv4(),
        imgURL: base64Image,
        date: `${formattedDate} ${formattedTime}`,
        fileName: file.name,
        content: contentString, 
        detectedParasites: detectedParasites,
      };
      
      // 🌟 ADDED LOGIC TO UPDATE LOCAL STORAGE 🌟
      const storedAnalyses = JSON.parse(localStorage.getItem('recentAnalyses')) || [];
      const updatedAnalyses = [...storedAnalyses, newAnalysis];
      localStorage.setItem('recentAnalyses', JSON.stringify(updatedAnalyses));
      
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