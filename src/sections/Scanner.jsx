import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

// Components
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import ImageUploader from "../components/ImageUploader";

// Constants & Data
import { 
  recentImages as recentImagesConstant, 
  recentAnalyses as recentAnalysesConstant, 
  possibleParasites as possibleParasitesConstant 
} from "../assets/constants";

/**
 * @description Generates a random set of parasites with a confidence level
 * @returns {Array<Object>} An array of parasite objects.
 */
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

/**
 * @description Generates a content string for a card based on detected parasites.
 * @param {Array<Object>} detectedParasites - An array of detected parasite objects.
 * @returns {string} The formatted content string.
 */
const generateContent = (detectedParasites) => {
  if (detectedParasites.length > 0) {
    const firstParasite = detectedParasites[0];
    return `Detectado: ${firstParasite.label} (1), Confianza: ${firstParasite.value}%`;
  }
  return 'Detectado: No se encontraron parásitos';
};

/**
 * @description Main component for the scanner page. Allows users to upload
 * an image for analysis and view a gallery of recent uploads.
 */
function Scanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayAnalyses, setDisplayAnalyses] = useState([]);
  const navigate = useNavigate(); 

  // Use useEffect to load and initialize data from localStorage only once.
  useEffect(() => {
    let storedAnalyses = JSON.parse(localStorage.getItem('recentAnalyses'));
    
    // Initialize localStorage with combined data if empty.
    if (!storedAnalyses || storedAnalyses.length === 0) {
      const combinedInitialData = [...recentAnalysesConstant, ...recentImagesConstant];
      
      const initialAnalyses = combinedInitialData.map(analysis => ({
        ...analysis,
        // Ensure a unique ID for each analysis
        id: analysis.id || uuidv4(),
        // Add a placeholder for detected parasites to avoid undefined issues
        detectedParasites: analysis.detectedParasites || [],
      }));
      
      // Store the combined data in localStorage and set the state.
      localStorage.setItem('recentAnalyses', JSON.stringify(initialAnalyses));
      setDisplayAnalyses(initialAnalyses);
    } else {
      // If data exists, simply set the state with it.
      setDisplayAnalyses(storedAnalyses);
    }
  }, []);

  // Use useMemo for the selected file name for performance.
  const selectedFileName = useMemo(() => {
    if (!selectedImage) return null;
    return selectedImage.fileName || selectedImage.imgURL.split('/').pop();
  }, [selectedImage]);

  /**
   * @description Handles a file selected by the user, generates a new analysis,
   * and updates localStorage.
   * @param {File} file - The uploaded file object.
   */
  const handleUploadedImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      
      // Generate unique analysis data
      const newAnalysis = {
        id: uuidv4(),
        imgURL: base64Image,
        date: new Date().toISOString().split('T')[0],
        fileName: file.name,
        // Generate random parasite detection and content string
        detectedParasites: generateRandomParasites(),
        content: generateContent(generateRandomParasites()),
      };
      
      // Update state and localStorage with the new analysis.
      const updatedAnalyses = [...displayAnalyses, newAnalysis];
      localStorage.setItem('recentAnalyses', JSON.stringify(updatedAnalyses));
      setDisplayAnalyses(updatedAnalyses);
      setSelectedImage(newAnalysis);
    };
    reader.readAsDataURL(file);
  };
  
  /**
   * @description Handles the click of an image card, setting it as the selected image.
   * @param {object} analysis - The analysis object of the clicked card.
   */
  const handleImageSelect = (analysis) => {
    setSelectedImage(analysis);
  };

  /**
   * @description Navigates to the results page if an image is selected.
   */
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
            {/* Header Section */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight min-w-72">Escáner</p>
            </div>
            
            {/* Image Uploader */}
            <ImageUploader 
              instruction="Arrastra y suelta imágenes aquí o haz clic para subir" 
              message="Formatos de archivo admitidos:" 
              typesOfFiles="JPG, PNG, TIFF" 
              selectedFileName={selectedFileName}
              onFileSelect={handleUploadedImage}
            />
            
            {/* Recent Images Gallery */}
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Imágenes recientes</h2>
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
            
            {/* Analyze Button */}
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

// PropTypes for the Scanner component, even if it doesn't receive props, for good practice.
Scanner.propTypes = {};

export default Scanner;