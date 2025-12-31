import { OrbitControls, useGLTF } from '@react-three/drei';
import { useRef, memo, useEffect, Suspense } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import ModelLoader from "./ModelLoader";
import * as THREE from "three";
import { DynamicModelProps, MaterialRefData, ModelProps } from '../types';

// URL del decodificador Draco para procesar los archivos con compresión
const DRACO_URL = "https://www.gstatic.com/draco/versioned/decoders/1.5.5/";

const DynamicModel = ({ 
  modelPath, 
  rotation, 
  isExpanded, 
  setIsExpanded, 
  setActivePart, 
  isXRayEnabled 
}: DynamicModelProps) => {
  // Se añade DRACO_URL como segundo parámetro para permitir la descompresión del modelo
  const { scene } = useGLTF(modelPath, DRACO_URL);
  const lastSelected = useRef<THREE.Object3D | null>(null);
  
  const materialRefs = useRef<Record<string, MaterialRefData>>({});
  const animationTarget = useRef({ 
    opacity: 1, 
    color: new THREE.Color('white') 
  });

  useEffect(() => {
    const targetOpacity = isXRayEnabled ? 0.05 : 1;
    const targetColor = isXRayEnabled ? new THREE.Color('#000000') : new THREE.Color('white');
    
    animationTarget.current.opacity = targetOpacity;
    animationTarget.current.color.copy(targetColor);

    if (Object.keys(materialRefs.current).length === 0) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;
          
          materialRefs.current[mesh.uuid] = {
            originalColor: material.color.clone(),
            originalOpacity: material.opacity,
          };
          material.transparent = true;
          material.needsUpdate = true;
        }
      });
    }
  }, [isXRayEnabled, scene]);

  useFrame((_state, delta) => {
    const speed = 5 * delta;
    
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && materialRefs.current[child.uuid]) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        const ref = materialRefs.current[mesh.uuid];
        const target = animationTarget.current;
        
        const finalTargetColor = ref.overrideColor || target.color;
        
        material.color.lerp(finalTargetColor, speed);
        material.opacity = THREE.MathUtils.lerp(material.opacity, target.opacity, speed);
      }
    });
  });

  const onPartSelect = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    if (isExpanded && !isXRayEnabled) {
      if (lastSelected.current) {
        const lastMesh = lastSelected.current as THREE.Mesh;
        if (materialRefs.current[lastMesh.uuid]) {
          materialRefs.current[lastMesh.uuid].overrideColor = null;
        }
      }

      const targetMesh = e.object as THREE.Mesh;
      materialRefs.current[targetMesh.uuid].overrideColor = new THREE.Color('cyan');
      
      lastSelected.current = targetMesh;
      setActivePart(targetMesh.name);
    } else {
      setIsExpanded(true);
    }
  };

  return <primitive object={scene} rotation={rotation} onClick={onPartSelect} />;
};

function Model({ 
  modelPath, 
  rotation, 
  isExpanded, 
  setIsExpanded, 
  activePart, 
  setActivePart, 
  isXRayEnabled, 
  focusPoint, 
  setFocusPoint, 
  yOffset 
}: ModelProps) {
  
  const orbitRef = useRef<any>(null);

  useFrame(() => {
    if (orbitRef.current && focusPoint && modelPath.endsWith("A.glb")) {
      const targetPosition = new THREE.Vector3(...focusPoint);
      orbitRef.current.target.lerp(targetPosition, 0.1);
      orbitRef.current.update();
    }
  });

  return (
    <>
      <ambientLight intensity={1} color="#fafafa" />
      <directionalLight position={[0, 0, 5]} intensity={7} />
      <OrbitControls
        enablePan={false}
        maxDistance={5}
        minDistance={1}
        ref={orbitRef}
        target={[0, yOffset, 0]} 
      />

      <Suspense fallback={<ModelLoader />}>
        {modelPath && (
          <DynamicModel
            modelPath={modelPath} 
            rotation={rotation} 
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            activePart={activePart}
            setActivePart={setActivePart}
            isXRayEnabled={isXRayEnabled}
            setFocusPoint={setFocusPoint}
          />
        )}
      </Suspense>
    </>
  );  
}

export default memo(Model);