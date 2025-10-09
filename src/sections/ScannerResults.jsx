import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// Componentes
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import HorizontalBarChart from "../components/HorizontalBarChart";
import Error from '../components/Error';

// Constantes
import { recentAnalyses as recentAnalysesConstant, recentImages as recentImagesConstant } from '../assets/constants';
import useImageAnalysisWorker from '../components/UseImageAnalysisWorker';

/**
 * @description Componente para mostrar los resultados de un análisis de parásitos
 * Dibuja recuadros delimitadores en una imagen y muestra los resultados.
 */
function ScannerResults() {
  const { analysisId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [analysis, setAnalysis] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Refs
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const progressBarRef = useRef(null);
  const scannerContainerRef = useRef(null);

  /**
   * @description Centraliza la lógica para encontrar el análisis,
   * buscando primero en el estado de la ubicación, luego en localStorage
   * y finalmente en las constantes.
   * Se ejecuta solo al montar el componente.
   */
  useEffect(() => {
    const localAnalyses = JSON.parse(localStorage.getItem('recentAnalyses')) || [];
    const combinedConstants = [...recentAnalysesConstant, ...recentImagesConstant];

    const foundAnalysis = location.state?.analysis ||
                          localAnalyses.find(a => a.id.toString() === analysisId) ||
                          combinedConstants.find(a => a.id.toString() === analysisId);
    
    // Si se encuentra el análisis, se guarda el estado y los parásitos detectados.
    if (foundAnalysis) {
      setAnalysis(foundAnalysis);
    } else {
      setAnalysis(null);
    }
  }, [analysisId, location.state]);

  /**
   * @description Dibuja la imagen original y los recuadros delimitadores en el canvas.
   */
  const drawCanvas = useCallback((results) => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    // Dibuja los recuadros delimitadores
    if (results && results.length > 0) {
      results.forEach(result => {
        ctx.strokeStyle = '#D1495B'; // Rojo
        ctx.lineWidth = 4;
        ctx.strokeRect(result.x, result.y, result.width, result.height);
      });
    }
  }, []);

  /**
   * @description Maneja la lógica del Web Worker para el análisis de imágenes.
   * Se ejecuta cuando el análisis está disponible.
   */
  const {detectedParasites, isLoading} = useImageAnalysisWorker(
    imageLoaded,
    analysis, 
    drawCanvas, 
    imgRef, 
    canvasRef, 
    progressBarRef, 
    scannerContainerRef);

  const aggregatedData = useMemo(() => {
    if (!detectedParasites || detectedParasites.length === 0) return [];

    const parasitesMap = detectedParasites.reduce((acc, currentBox) => {
      const parasite = currentBox.detectedParasites[0];
      const label = parasite.label;
      const confidenceLevel = parasite.value;

      if (acc[label]) {
        acc[label].sum += confidenceLevel;
        acc[label].count += 1;
      } else {
        acc[label] = {label: label, sum: confidenceLevel, count: 1}
      }

      return acc;
    }, {})

    return Object.values(parasitesMap).map((parasite) => ({
      label: parasite.label,
      value: parasite.sum/parasite.count
    }));
  }, [detectedParasites]); 

  /**
   * @description Navega a la página de feedback y guarda el análisis actual en localStorage.
   */
  const handleSendFeedback = () => {
    // Se guarda el análisis con los datos detectados para que la página de feedback
    // pueda acceder a ellos.
    localStorage.setItem('currentAnalysis', JSON.stringify(analysis));
    navigate(`/feedback/${analysisId}`);
  };
  // Renderiza un componente de error si el análisis no se encuentra.
  if (!analysis) {
    return (
      <Error
        title="Error: Análisis no encontrado"
        message="Lo sentimos, no pudimos encontrar los resultados para este análisis."
        linkText="Volver al historial de análisis"
        linkTo="/history"
      />
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight min-w-72">Resultados del Análisis</p>
            </div>
            <div className="flex w-full grow bg-white @container p-4" ref={scannerContainerRef}>
              <div className="w-full gap-1 overflow-hidden bg-white @[480px]:gap-2 aspect-[3/2] rounded-lg flex relative">
                {analysis.imgURL && (
                  <img 
                    ref={imgRef}
                    src={analysis.imgURL}
                    alt="Imagen del análisis"
                    crossOrigin="anonymous" 
                    style={{ display: 'none' }}
                    onLoad={() => setImageLoaded(true)}
                  />
                )}
                <canvas ref={canvasRef} className="w-full h-full object-cover rounded-none"></canvas>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg flex-col">
                    <p>Analizando imagen...</p>
                    <div className="w-4/5 h-2 bg-gray-200 rounded-full mt-4">
                      <div 
                        ref={progressBarRef}
                        className="h-2 bg-[#00c795] rounded-full" 
                        style={{ width: '0%' }}
                    />
                    </div>
                  </div>
                )} 
              </div>
            </div>
            <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Parásitos Detectados</h3>
            <div className="px-4 py-3 @container">
                <Table parasites={aggregatedData} /> 
            </div>
          </div>
          <div className="layout-content-container flex flex-col w-[360px]">
            <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Resumen del Análisis</h3>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dae7e3] p-6">
                <p className="text-[#101816] text-base font-medium leading-normal">Distribución de Parásitos</p>
                <div className="h-full">
                  <HorizontalBarChart data={aggregatedData} />
                </div>
              </div>
            </div>
            <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Comentarios y Correcciones</h3>
            <p className="text-[#101816] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Ayúdanos a mejorar nuestro modelo de detección proporcionando comentarios sobre el análisis. Puedes corregir cualquier parásito mal identificado o agregar nuevos.
            </p>
            <div className="flex px-4 py-3 justify-end">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#00c795] text-[#101816] text-sm font-bold leading-normal tracking-[0.015em]"
                onClick={handleSendFeedback}
              >
                <span className="truncate">Enviar Comentarios</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ScannerResults.propTypes = {};

export default ScannerResults;