import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { ThreeElements } from '@react-three/fiber';

type GLTFResult = GLTF & {
  nodes: {
    mesh_0: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
};

/**
 * @description Componente 3D del Ascaris lumbricoides adulto.
 * @param props Usamos ThreeElements['group'] que es el estándar actual de R3F v8+
 */
export function AscarisA(props: ThreeElements['group']) {
  const { nodes } = useGLTF('/models/ascaris-lumbricoides_A.glb') as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.mesh_0.geometry}
        material={nodes.mesh_0.material}
        name="ascaris_adult_mesh"
      />
    </group>
  );
}

useGLTF.preload('/models/ascaris-lumbricoides_A.glb');
