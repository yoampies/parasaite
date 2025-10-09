import React, {useEffect} from 'react'
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function WebGLCleanup({modelPath}) {
  const {gl} = useThree();
  
    useEffect(() => {
        return () => {
            useGLTF.clear(modelPath);
        }
    }, [gl, modelPath]);   

    return null;
}

export default WebGLCleanup