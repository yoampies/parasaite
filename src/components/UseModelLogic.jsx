// useModelLogic.js

import { useState, useEffect, useMemo } from 'react';
// ¡ATENCIÓN! Revisa que esta ruta sea correcta para tu proyecto:
import { model_mesh_details } from '../assets/constants'; 

/**
 * Hook personalizado para manejar el estado, los efectos y la lógica 
 * derivada (como los detalles del parásito) para el modelo 3D expandido.
 * * @param {string} modelPath - Ruta del archivo GLB.
 * @param {number} yOffset - Desplazamiento vertical del modelo.
 */
export const useModelLogic = (modelPath, yOffset) => {
    
    // --- 1. ESTADO ---
    // Mantenemos el estado que antes estaba en ExpandedModelCard
    const [activePart, setActivePart] = useState(null);
    const [isXRayEnabled, setIsXRayEnabled] = useState(false);
    // Usamos yOffset para inicializar el punto de foco, como hacías antes
    const [focusPoint, setFocusPoint] = useState([0, yOffset, 0]); 

    // --- 2. EFECTOS (Lógica de Rayos X) ---
    // Mantenemos el useEffect que resetea la vista al activar/desactivar Rayos X
    useEffect(() => {
        if (isXRayEnabled) {
            setFocusPoint([0, yOffset, 0]);
            setActivePart(null); 
        }
    }, [isXRayEnabled, yOffset]); // Depende del estado de Rayos X y el offset

    // --- 3. LÓGICA DERIVADA (Detalles del parásito) ---
    // Usamos useMemo para calcular los detalles solo cuando cambie el modelo, Rayos X, o la parte activa
    const parasiteDetails = useMemo(() => {
        
        // Lógica de extracción de datos
        const parts = modelPath.split("/");
        const filename = parts.pop();
        const fullModelSlug = filename.replace(".glb", "");
        const parasiteData = model_mesh_details[fullModelSlug];

        // Lógica condicional
        if (isXRayEnabled) {
            return parasiteData?.["XRAY_DETAILS"];
        }
        return parasiteData?.[activePart] || parasiteData?.["DEFAULT"];
        
    }, [modelPath, isXRayEnabled, activePart]); 


    // --- 4. RETURN DEL HOOK ---
    // Devolvemos TODO lo que el componente ExpandedModelCard.jsx necesita
    return {
        activePart,
        setActivePart,
        isXRayEnabled,
        setIsXRayEnabled,
        focusPoint,
        setFocusPoint,
        parasiteDetails, // El objeto que contiene título y descripción
    };
};