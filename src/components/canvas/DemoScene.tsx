import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

/** Rotating placeholder shown before a puzzle is loaded */
export function DemoScene() {
  const cubeRef = useRef<Mesh>(null)
  const torusRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.4
      cubeRef.current.rotation.y += delta * 0.6
    }
    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.3
      torusRef.current.rotation.y -= delta * 0.5
    }
  })

  return (
    <>
      <mesh ref={cubeRef} position={[-2.5, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color="#4f46e5"
          metalness={0.6}
          roughness={0.2}
          emissive="#1e1b4b"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh ref={torusRef} position={[2.5, 1.2, 0]} castShadow>
        <torusGeometry args={[1.2, 0.45, 16, 48]} />
        <meshStandardMaterial
          color="#7c3aed"
          metalness={0.5}
          roughness={0.25}
          emissive="#2e1065"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Shadow-receiving floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </>
  )
}
