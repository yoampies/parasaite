import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { ThreeElements } from '@react-three/fiber'

type GLTFAction = THREE.AnimationClip

type GLTFResult = GLTF & {
  nodes: {
    mesh_0: THREE.Mesh
  }
  materials: {
    [key: string]: THREE.Material
  }
  animations: GLTFAction[]
}

/**
 * @description Componente 3D optimizado del huevo de Ascaris lumbricoides.
 * @param props Utiliza ThreeElements['group'] para evitar el error de namespace 'JSX'.
 */
export function AscarisH(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/ascaris-lumbricoides_H-transformed.glb') as unknown as GLTFResult
  
  return (
    <group {...props} dispose={null}>
      <mesh 
        geometry={nodes.mesh_0.geometry} 
        material={nodes.mesh_0.material} 
        name="ascaris_egg_mesh"
      />
    </group>
  )
}

useGLTF.preload('/ascaris-lumbricoides_H-transformed.glb')