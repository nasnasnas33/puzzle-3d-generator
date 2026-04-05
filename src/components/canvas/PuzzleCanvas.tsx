import { useEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import type { ReactNode } from 'react'
import * as THREE from 'three'

interface PuzzleCanvasProps {
  /** 3D content to render inside the scene */
  children?: ReactNode
  /** Show the reference grid (default: true) */
  showGrid?: boolean
  /** Camera zoom level — distance from origin (default: 14, range: 6–30) */
  zoom?: number
}

/** Smoothly lerps the camera to match the zoom slider value */
function ZoomSync({ zoom }: { zoom: number }) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, zoom * 0.55, zoom))

  useEffect(() => {
    target.current.set(0, zoom * 0.55, zoom)
  }, [zoom])

  useFrame(() => {
    camera.position.lerp(target.current, 0.1)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export function PuzzleCanvas({
  children,
  showGrid = true,
  zoom = 14,
}: PuzzleCanvasProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#05050a' }}>
      <Canvas
        camera={{ position: [0, zoom * 0.55, zoom], fov: 45, near: 0.1, far: 200 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#05050a' }}
      >
        {/* Camera zoom control */}
        <ZoomSync zoom={zoom} />

        {/* Lighting */}
        <ambientLight intensity={0.4} color="#8888ff" />
        <directionalLight
          position={[10, 16, 10]}
          intensity={1.2}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.1}
          shadow-camera-far={80}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <pointLight position={[-8, 6, -8]} intensity={0.6} color="#6366f1" />
        <pointLight position={[8, 4, 8]} intensity={0.4} color="#8b5cf6" />

        {/* Environment for reflections */}
        <Environment preset="night" />

        {/* Reference grid */}
        {showGrid && (
          <Grid
            args={[30, 30]}
            position={[0, -0.01, 0]}
            cellSize={1}
            cellThickness={0.4}
            cellColor="#1e1e3a"
            sectionSize={5}
            sectionThickness={0.8}
            sectionColor="#2d2d5e"
            fadeDistance={28}
            fadeStrength={1.2}
            infiniteGrid
          />
        )}

        {/* Scene content */}
        {children}

        {/* Camera controls — rotation and pan disabled; zoom via slider only */}
        <OrbitControls
          makeDefault
          enableRotate={false}
          enablePan={false}
          enableZoom={false}
          enableDamping={false}
        />
      </Canvas>
    </div>
  )
}
