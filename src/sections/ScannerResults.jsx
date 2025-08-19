// ScannerResults.jsx

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
// Componentes
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import HorizontalBarChart from "../components/HorizontalBarChart";
import Error from '../components/Error';
// Constantes
import { recentAnalyses as recentAnalysesConstant, recentImages as recentImagesConstant } from '../assets/constants';

function ScannerResults() {
    const { analysisId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [analysis, setAnalysis] = useState(null);
    const [detectedParasites, setDetectedParasites] = useState([]);

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
        const analysisWithResults = { ...analysis, detectedParasites };
        saveAnalysisToLocalStorage(analysisWithResults);
        localStorage.setItem('currentAnalysis', JSON.stringify(analysisWithResults));
        navigate(`/feedback/${analysisId}`);
    };

    useEffect(() => {
        if (!analysis || !imgRef.current) return;

        const startAnalysis = () => {
            // 🟢 Corregido: Ahora verificamos si detectedParasites es un array y tiene elementos.
            if (Array.isArray(analysis.detectedParasites) && analysis.detectedParasites.length > 0) {
                console.log('Usando datos existentes de la constante:', analysis.detectedParasites);
                setIsLoading(false);
                setDetectedParasites(analysis.detectedParasites);
                
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
                canvas.width = imgRef.current.naturalWidth;
                canvas.height = imgRef.current.naturalHeight;
                context.drawImage(imgRef.current, 0, 0);

                if (analysis.x && analysis.y && analysis.width && analysis.height) {
                    context.strokeStyle = '#D1495B';
                    context.lineWidth = 4;
                    context.strokeRect(analysis.x, analysis.y, analysis.width, analysis.height);
                }
            } else {
                // Si no hay parásitos o no es un array, se ejecuta la simulación
                console.log('Iniciando simulación de análisis...');
                const worker = new Worker('/worker.js');
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
                canvas.width = imgRef.current.naturalWidth;
                canvas.height = imgRef.current.naturalHeight;
                context.drawImage(imgRef.current, 0, 0);

                worker.postMessage({
                    imageData: 'simulated image data',
                    imageWidth: canvas.width,
                    imageHeight: canvas.height,
                });

                worker.onmessage = (e) => {
                    const { x, y, width, height, detectedParasites: workerParasites } = e.data;
                    setIsLoading(false);
                    setDetectedParasites(workerParasites);

                    context.strokeStyle = '#D1495B';
                    context.lineWidth = 4;

                    gsap.fromTo(
                        { drawPercent: 0 },
                        { drawPercent: 1 },
                        {
                            duration: 1.5,
                            onUpdate: function() {
                                context.clearRect(0, 0, canvas.width, canvas.height);
                                context.drawImage(imgRef.current, 0, 0);
                                const currentWidth = width * this.targets()[0].drawPercent;
                                const currentHeight = height * this.targets()[0].drawPercent;
                                context.strokeRect(x, y, currentWidth, currentHeight);
                            },
                            onComplete: () => {
                                const updatedAnalysis = { ...analysis, detectedParasites: workerParasites, x, y, width, height };
                                saveAnalysisToLocalStorage(updatedAnalysis);
                            }
                        }
                    );
                };
                return () => worker.terminate();
            }
        };

        if (imgRef.current.complete) {
            startAnalysis();
        } else {
            imgRef.current.onload = startAnalysis;
        }
        
        // 🚨 AQUÍ ESTÁ EL CAMBIO IMPORTANTE: Agrega una verificación `if (imgRef.current)`
        return () => {
            if (imgRef.current) {
                imgRef.current.onload = null;
            }
        };
    }, [analysis, saveAnalysisToLocalStorage]);

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
                            <Table parasites={detectedParasites} /> 
                        </div>
                    </div>
                    <div className="layout-content-container flex flex-col w-[360px]">
                        <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Resumen del Análisis</h3>
                        <div className="flex flex-wrap gap-4 px-4 py-6">
                            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dae7e3] p-6">
                                <p className="text-[#101816] text-base font-medium leading-normal">Distribución de Parásitos</p>
                                <div className="h-full">
                                    <HorizontalBarChart data={detectedParasites} />
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