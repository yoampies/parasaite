import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import Model from './Model';
import { ModelCanvasProps } from '../types';

function ModelCanvas({
  modelPath,
  rotation,
  scrollPositionRef,
  setIsExpanded,
  setExpandedModelPath,
}: ModelCanvasProps) {
  useEffect(() => {
    return () => {
      useGLTF.clear(modelPath);
    };
  }, [modelPath]);

  const isAscaris = modelPath === '/models/ascaris-lumbricoides_A.glb';
  const ascarisCloseUp: [number, number, number] = isAscaris ? [0, 0.5, 1] : [0, 0, 3];
  const yOffset = isAscaris ? 0.3 : 0;

  return (
    <div className="w-full h-[500px] p-4">
      <Canvas camera={{ position: ascarisCloseUp, fov: 45 }} dpr={[1, 2]}>
        <Model
          modelPath={modelPath}
          rotation={rotation}
          isExpanded={false}
          yOffset={yOffset}
          setIsExpanded={() => {
            // eslint-disable-next-line react-compiler/react-compiler
            scrollPositionRef.current = window.scrollY;
            setIsExpanded(true);
            setExpandedModelPath(modelPath);
          }}
          activePart={null}
          setActivePart={() => {}}
          isXRayEnabled={false}
          focusPoint={null}
          setFocusPoint={() => {}}
        />
      </Canvas>
    </div>
  );
}

export default ModelCanvas;
