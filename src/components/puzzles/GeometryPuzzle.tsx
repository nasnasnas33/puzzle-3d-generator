import { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import {
  explodeMesh,
  type ShapeType,
  type GeometryShard,
  type ExploderConfig,
} from '../../lib/geometry/exploder'

const SNAP_THRESHOLD = 0.7
const SHARD_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#7c3aed']

interface GeometryPuzzleProps {
  shape: ShapeType
  shardCount?: number
  onSolved?: () => void
}

function buildShapeGeometry(shape: ShapeType): THREE.BufferGeometry {
  switch (shape) {
    case 'sphere':
      return new THREE.SphereGeometry(1, 8, 6)
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(1, 0)
    case 'torus':
      return new THREE.TorusGeometry(0.8, 0.35, 8, 12)
    case 'octahedron':
      return new THREE.OctahedronGeometry(1, 0)
  }
}

interface ShardMeshProps {
  shard: GeometryShard
  shape: ShapeType
  isSelected: boolean
  onPointerDown: (id: string) => void
  onPointerUp: () => void
}

function ShardMesh({ shard, shape, isSelected, onPointerDown, onPointerUp }: ShardMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    const targetPos = new THREE.Vector3(...shard.position)
    const targetRot = new THREE.Euler(...shard.rotation)
    meshRef.current.position.lerp(targetPos, 0.15)
    meshRef.current.rotation.x += (targetRot.x - meshRef.current.rotation.x) * 0.15
    meshRef.current.rotation.y += (targetRot.y - meshRef.current.rotation.y) * 0.15
    meshRef.current.rotation.z += (targetRot.z - meshRef.current.rotation.z) * 0.15
  })

  const geo = useMemo(() => buildShapeGeometry(shape), [shape])
  const color = SHARD_COLORS[shard.colorIndex]
  const emissive = isSelected ? '#3730a3' : shard.locked ? '#1e1b4b' : '#000'

  return (
    <mesh
      ref={meshRef}
      position={shard.position}
      rotation={shard.rotation}
      scale={shard.scale}
      castShadow
      onPointerDown={(e) => { e.stopPropagation(); onPointerDown(shard.id) }}
      onPointerUp={onPointerUp}
    >
      <primitive object={geo} attach="geometry" />
      <meshStandardMaterial
        color={shard.locked ? '#a5b4fc' : color}
        emissive={emissive}
        emissiveIntensity={isSelected ? 0.4 : 0.15}
        metalness={0.5}
        roughness={0.25}
        wireframe={false}
      />
    </mesh>
  )
}

export function GeometryPuzzle({ shape, shardCount = 10, onSolved }: GeometryPuzzleProps) {
  const { camera, raycaster } = useThree()

  const config: ExploderConfig = useMemo(
    () => ({ shardCount, spreadRadius: 5, seed: shape.charCodeAt(0) }),
    [shardCount, shape],
  )

  const [shards, setShards] = useState<GeometryShard[]>(() => explodeMesh(shape, config))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)

  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const dragOffset = useRef(new THREE.Vector3())
  const isDragging = useRef(false)

  const handlePointerDown = (id: string) => {
    setSelectedId(id)
    isDragging.current = true
    const shard = shards.find((s) => s.id === id)
    if (!shard) return
    const intersection = new THREE.Vector3()
    raycaster.ray.intersectPlane(dragPlane, intersection)
    dragOffset.current.set(
      shard.position[0] - intersection.x,
      0,
      shard.position[2] - intersection.z,
    )
  }

  useFrame(({ pointer }) => {
    if (!isDragging.current || !selectedId) return
    raycaster.setFromCamera(pointer, camera)
    const intersection = new THREE.Vector3()
    if (!raycaster.ray.intersectPlane(dragPlane, intersection)) return

    const nx = intersection.x + dragOffset.current.x
    const nz = intersection.z + dragOffset.current.z

    setShards((prev) =>
      prev.map((s) =>
        s.id === selectedId && !s.locked
          ? { ...s, position: [nx, s.position[1], nz] }
          : s,
      ),
    )
  })

  const handlePointerUp = () => {
    if (!selectedId) return
    isDragging.current = false

    setShards((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== selectedId || s.locked) return s
        const dx = Math.abs(s.position[0] - s.targetPosition[0])
        const dy = Math.abs(s.position[1] - s.targetPosition[1])
        const dz = Math.abs(s.position[2] - s.targetPosition[2])
        if (dx < SNAP_THRESHOLD && dy < SNAP_THRESHOLD && dz < SNAP_THRESHOLD) {
          return {
            ...s,
            position: s.targetPosition,
            rotation: s.targetRotation,
            locked: true,
          }
        }
        return s
      })

      if (updated.every((s) => s.locked) && !solved) {
        setSolved(true)
        onSolved?.()
      }
      return updated
    })

    setSelectedId(null)
  }

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -3, 0]}>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.2} />
      </mesh>

      {shards.map((shard) => (
        <ShardMesh
          key={shard.id}
          shard={shard}
          shape={shape}
          isSelected={shard.id === selectedId}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        />
      ))}

      {solved && (
        <Html center>
          <div style={{
            background: 'rgba(5,5,10,0.92)',
            border: '1px solid rgba(139,92,246,0.6)',
            color: '#c4b5fd',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            padding: '1.2rem 2.4rem',
            textAlign: 'center',
          }}>
            ✓ SHAPE RESTORED
          </div>
        </Html>
      )}
    </>
  )
}
