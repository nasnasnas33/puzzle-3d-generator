import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import type { ReactNode } from 'react'

interface PuzzleCanvasProps {
  /** 3D content to render inside the scene */
  children?: ReactNode
  /** Show the reference grid (default: true) */
  showGrid?: boolean
  /** Camera position [x, y, z] (default: [0, 8, 14]) */
  cameraPosition?: [number, number, number]
}

export function PuzzleCanvas({
  children,
  showGrid = true,
  cameraPosition = [0, 8, 14],
}: PuzzleCanvasProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#05050a' }}>
      <Canvas
        camera={{ position: cameraPosition, fov: 45, near: 0.1, far: 200 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#05050a' }}
      >
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

        {/* Camera controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.07}
          minDistance={3}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
    </div>
  )
}
