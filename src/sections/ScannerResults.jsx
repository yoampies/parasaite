// ScannerResults.jsx

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import HorizontalBarChart from "../components/HorizontalBarChart";
import Error from '../components/Error';
import { recentAnalyses as recentAnalysesConstant, recentImages as recentImagesConstant } from '../assets/constants';

function ScannerResults() {
    const { analysisId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [analysis, setAnalysis] = useState(null);
    const [analysisResults, setAnalysisResults] = useState([]);

    const saveAnalysisToLocalStorage = useCallback((updatedAnalysis) => {
        const localAnalyses = JSON.parse(localStorage.getItem('recentAnalyses')) || [];
        const index = localAnalyses.findIndex(a => a.id === updatedAnalysis.id);

        if (index !== -1) {
            localAnalyses[index] = updatedAnalysis;
        } else {
            const isFromConstants = recentAnalysesConstant.find(a => a.id === updatedAnalysis.id) || recentImagesConstant.find(a => a.id === updatedAnalysis.id);
            if (!isFromConstants) {
                localAnalyses.unshift(updatedAnalysis);
            }
        }
        localStorage.setItem('recentAnalyses', JSON.stringify(localAnalyses));
    }, []);

    useEffect(() => {
        const localAnalyses = JSON.parse(localStorage.getItem('recentAnalyses')) || [];
        const combinedConstants = [...recentAnalysesConstant, ...recentImagesConstant];
        
        let currentAnalysis = location.state?.analysis ||
            localAnalyses.find(a => a.id.toString() === analysisId) ||
            combinedConstants.find(a => a.id.toString() === analysisId);
            
        setAnalysis(currentAnalysis);
    }, [analysisId, location.state]);

    const handleSendFeedback = () => {
        const analysisWithResults = { ...analysis, detectedParasites: analysisResults.flatMap(r => r.detectedParasites) };
        saveAnalysisToLocalStorage(analysisWithResults);
        localStorage.setItem('currentAnalysis', JSON.stringify(analysisWithResults));
        navigate(`/feedback/${analysisId}`);
    };

    useEffect(() => {
        if (!analysis || !imgRef.current || !canvasRef.current) return;

        const img = imgRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const worker = new Worker('/worker.js');

        const drawCanvas = (results) => {
            // Dibuja la imagen original primero
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            
            // Dibuja los recuadros delimitadores basándose en los resultados del worker
            if (results && results.length > 0) {
                results.forEach(result => {
                    ctx.strokeStyle = '#D1495B'; // Rojo
                    ctx.lineWidth = 4;
                    ctx.strokeRect(result.x, result.y, result.width, result.height);
                });
            }
            setIsLoading(false);
        };

        const handleAnalysis = async () => {
            try {
                const imageBitmap = await createImageBitmap(img);
                
                // Envía la imagen y los datos de parásitos al worker
                worker.postMessage({
                    imageBitmap,
                    imageWidth: img.naturalWidth,
                    imageHeight: img.naturalHeight,
                    detectedParasites: analysis.detectedParasites,
                }, [imageBitmap]);
            } catch (error) {
                console.error("Error creating ImageBitmap:", error);
                setIsLoading(false);
            }
        };

        worker.onmessage = (e) => {
            const { results } = e.data;
            setAnalysisResults(results); // Actualiza el estado con los resultados de la detección
            drawCanvas(results); // Llama a la función de dibujo con los resultados
        };

        if (img.complete) {
            handleAnalysis();
        } else {
            img.onload = () => handleAnalysis();
        }

        return () => {
            if (img) img.onload = null;
            worker.terminate();
        };

    }, [analysis]);

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
                        <div className="flex w-full grow bg-white @container p-4">
                            <div className="w-full gap-1 overflow-hidden bg-white @[480px]:gap-2 aspect-[3/2] rounded-lg flex relative">
                                {analysis.imgURL && (
                                    <img 
                                        ref={imgRef}
                                        src={analysis.imgURL}
                                        alt="Imagen del análisis"
                                        crossOrigin="anonymous" 
                                        style={{ display: 'none' }}
                                    />
                                )}
                                <canvas ref={canvasRef} className="w-full h-full object-cover rounded-none"></canvas>
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg">
                                        Analizando imagen...
                                    </div>
                                )}
                            </div>
                        </div>
                        <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Parásitos Detectados</h3>
                        <div className="px-4 py-3 @container">
                            <Table parasites={analysisResults.flatMap(r => r.detectedParasites)} /> 
                        </div>
                    </div>
                    <div className="layout-content-container flex flex-col w-[360px]">
                        <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Resumen del Análisis</h3>
                        <div className="flex flex-wrap gap-4 px-4 py-6">
                            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dae7e3] p-6">
                                <p className="text-[#101816] text-base font-medium leading-normal">Distribución de Parásitos</p>
                                <div className="h-full">
                                    <HorizontalBarChart data={analysisResults.flatMap(r => r.detectedParasites)} />
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

export default ScannerResults;