import { useGLTF } from '@react-three/drei'

export function AscarisA(props) {
  const { nodes, materials } = useGLTF('/models/ascaris-lumbricoides_A.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.mesh_0.geometry} material={nodes.mesh_0.material} />
    </group>
  )
}

useGLTF.preload('/models/ascaris-lumbricoides_A.glb')