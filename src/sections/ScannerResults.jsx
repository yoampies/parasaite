// ScannerResults.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
// Componentes
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import HorizontalBarChart from "../components/HorizontalBarChart";
import Error from '../components/Error';
// Constantes
import { recentAnalyses } from '../assets/constants';

function ScannerResults() {
    const { analysisId } = useParams();
    const location = useLocation();

    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    let analysis = location.state?.analysis;
    if (!analysis) {
        analysis = recentAnalyses.find(a => a.id.toString() === analysisId);
    }

    useEffect(() => {
        if (!analysis || !imgRef.current) return;

        // Se crea el Web Worker
        const worker = new Worker('/worker.js');

        // Cuando la imagen se cargue en el navegador, se procesa en el canvas
        imgRef.current.onload = () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Aseguramos que el canvas tenga el mismo tamaño que la imagen
            canvas.width = imgRef.current.naturalWidth;
            canvas.height = imgRef.current.naturalHeight;
            context.drawImage(imgRef.current, 0, 0);

            // Inicia la simulación en el Web Worker
            console.log('Principal: Enviando imagen al Web Worker...');
            worker.postMessage({ imageData: 'simulated image data' });
        };

        // Manejar el mensaje que viene del Web Worker
        worker.onmessage = (e) => {
            console.log('Principal: Recibiendo coordenadas del Web Worker.');
            const { x, y, width, height } = e.data;
            setIsLoading(false);
            
            // Dibujamos y animamos el recuadro con GSAP
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            context.strokeStyle = '#D1495B'; // Color del recuadro
            context.lineWidth = 4; // Grosor de la línea
            
            // Animación del recuadro
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
                    }
                }
            );
        };
        
        // Limpiamos el worker al desmontar el componente
        return () => worker.terminate();
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
    
    const detectedParasites = analysis.detectedParasites || [];

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
                                {/* Imagen oculta para cargar los datos en el canvas */}
                                <img 
                                    ref={imgRef}
                                    src={analysis.imgURL}
                                    alt="Imagen del análisis"
                                    style={{ display: 'none' }}
                                />
                                {/* El canvas para dibujar la imagen y la animación */}
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
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#00c795] text-[#101816] text-sm font-bold leading-normal tracking-[0.015em]">
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