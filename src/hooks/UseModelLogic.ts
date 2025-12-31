import { useState, useEffect, useMemo } from 'react';
import { model_mesh_details } from '../assets/constants'; 
import { IMeshInfo, IModelDetails } from '../types';

/**
 * Hook personalizado para manejar la lógica del modelo 3D.
 * Gestiona el sistema de Rayos X, selección de partes y extracción de metadatos médicos.
 */
export const useModelLogic = (modelPath: string, yOffset: number) => {
  
  // --- 1. ESTADO ---
  
  // Almacena el nombre de la pieza anatómica seleccionada
  const [activePart, setActivePart] = useState<string | null>(null);
  
  // Controla el modo de visualización de transparencia
  const [isXRayEnabled, setIsXRayEnabled] = useState<boolean>(false);
  
  // Punto de enfoque para la cámara (OrbitControls target). 
  // Se define como tupla [x, y, z] para compatibilidad estricta con Three.js
  const [focusPoint, setFocusPoint] = useState<[number, number, number] | null>([0, yOffset, 0]); 

  // --- 2. EFECTOS ---

  useEffect(() => {
    if (isXRayEnabled) {
      // Al activar Rayos X, reseteamos el foco al centro y limpiamos la selección
      setFocusPoint([0, yOffset, 0] as [number, number, number]);
      setActivePart(null); 
    }
  }, [isXRayEnabled, yOffset]);

  // --- 3. LÓGICA DERIVADA ---

  const parasiteDetails = useMemo((): IMeshInfo => {
    // 1. Extracción del slug del archivo (ej: "ascaris-lumbricoides_A")
    const parts = modelPath.split("/");
    const filename = parts.pop() || "";
    const fullModelSlug = filename.replace(".glb", "");
    
    // 2. Acceso seguro a las constantes
    const parasiteData = (model_mesh_details as Record<string, IModelDetails>)[fullModelSlug];

    // 3. Prioridad de visualización: Rayos X > Parte Activa > Default
    if (isXRayEnabled && parasiteData?.XRAY_DETAILS) {
      return parasiteData.XRAY_DETAILS;
    }

    if (activePart && parasiteData?.[activePart]) {
      return parasiteData[activePart];
    }

    return parasiteData?.DEFAULT || { title: "Cargando...", description: "Obteniendo datos anatómicos..." };
    
  }, [modelPath, isXRayEnabled, activePart]); 

  // --- 4. INTERFAZ DE SALIDA ---

  return {
    activePart,
    setActivePart,
    isXRayEnabled,
    setIsXRayEnabled,
    focusPoint,
    setFocusPoint,
    parasiteDetails, 
  };
};