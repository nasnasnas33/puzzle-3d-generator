import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture, Html } from '@react-three/drei'
import * as THREE from 'three'
import { generateJigsawPieces, type JigsawConfig, type JigsawPiece } from '../../lib/jigsaw/generator'

interface JigsawPuzzleProps {
  imageUrl: string
  cols?: number
  rows?: number
  onSolved?: () => void
}

const SNAP_THRESHOLD = 0.6
const PIECE_DEPTH = 0.18
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 7.5

/** Build a flat rectangular geometry for a single jigsaw piece with correct UV mapping */
function buildPieceGeometry(
  piece: JigsawPiece,
  config: JigsawConfig,
): THREE.BufferGeometry {
  const cellW = config.width / config.cols
  const cellH = config.height / config.rows

  // Simple extruded rectangle (connector tabs are visual-only for now via UV texture)
  const shape = new THREE.Shape()
  const hw = cellW / 2
  const hh = cellH / 2
  shape.moveTo(-hw, -hh)
  shape.lineTo(hw, -hh)
  shape.lineTo(hw, hh)
  shape.lineTo(-hw, hh)
  shape.closePath()

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: PIECE_DEPTH,
    bevelEnabled: true,
    bevelSize: 0.04,
    bevelThickness: 0.04,
    bevelSegments: 2,
  }

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)

  // Remap UV for the front face to match the piece's portion of the image
  const pos = geo.attributes.position as THREE.BufferAttribute
  const uv = geo.attributes.uv as THREE.BufferAttribute
  const { u0, u1, v0, v1 } = piece.uv

  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i)
    if (z > PIECE_DEPTH * 0.5) {
      // Front face: map local XY → piece UV range
      const lx = (pos.getX(i) + hw) / cellW
      const ly = (pos.getY(i) + hh) / cellH
      uv.setXY(i, u0 + lx * (u1 - u0), v0 + ly * (v1 - v0))
    }
  }

  uv.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

interface PieceObjectProps {
  piece: JigsawPiece
  config: JigsawConfig
  texture: THREE.Texture
  isSelected: boolean
  onPointerDown: (id: string) => void
  onPointerUp: () => void
}

function PieceObject({ piece, config, texture, isSelected, onPointerDown, onPointerUp }: PieceObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [pos, setPos] = useState<[number, number, number]>(piece.position as [number, number, number])

  useEffect(() => {
    setPos(piece.position as [number, number, number])
  }, [piece.position])

  useFrame(() => {
    if (!meshRef.current) return
    const target = new THREE.Vector3(...pos)
    meshRef.current.position.lerp(target, 0.18)
  })

  const geo = useMemo(
    () => buildPieceGeometry(piece, config),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [piece.id],
  )

  const color = piece.locked ? '#a5b4fc' : isSelected ? '#c4b5fd' : '#ffffff'
  const emissive = isSelected ? '#3730a3' : piece.locked ? '#1e1b4b' : '#000000'

  return (
    <mesh
      ref={meshRef}
      position={pos}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
      onPointerDown={(e) => { e.stopPropagation(); onPointerDown(piece.id) }}
      onPointerUp={onPointerUp}
    >
      <primitive object={geo} attach="geometry" />
      <meshStandardMaterial
        map={texture}
        color={color}
        emissive={emissive}
        emissiveIntensity={0.15}
        metalness={0.1}
        roughness={0.4}
      />
    </mesh>
  )
}

export function JigsawPuzzle({ imageUrl, cols = 4, rows = 3, onSolved }: JigsawPuzzleProps) {
  const texture = useTexture(imageUrl)
  const { camera, raycaster } = useThree()

  const config: JigsawConfig = useMemo(() => ({
    cols,
    rows,
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    depth: PIECE_DEPTH,
  }), [cols, rows])

  const [pieces, setPieces] = useState<JigsawPiece[]>(() => generateJigsawPieces(config))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)

  // Flip texture vertically so it maps correctly
  useEffect(() => {
    texture.flipY = false
    texture.needsUpdate = true
  }, [texture])

  // Drag piece on XZ plane
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const dragOffset = useRef(new THREE.Vector3())
  const isDragging = useRef(false)

  const handlePointerDown = (id: string) => {
    setSelectedId(id)
    isDragging.current = true
    // Compute offset between piece position and ray-plane intersection
    const piece = pieces.find((p) => p.id === id)
    if (!piece) return
    const intersection = new THREE.Vector3()
    raycaster.ray.intersectPlane(dragPlane, intersection)
    dragOffset.current.set(
      piece.position[0] - intersection.x,
      0,
      piece.position[2] - intersection.z,
    )
  }

  useFrame(({ pointer }) => {
    if (!isDragging.current || !selectedId) return
    raycaster.setFromCamera(pointer, camera)
    const intersection = new THREE.Vector3()
    if (!raycaster.ray.intersectPlane(dragPlane, intersection)) return

    const newX = intersection.x + dragOffset.current.x
    const newZ = intersection.z + dragOffset.current.z

    setPieces((prev) =>
      prev.map((p) =>
        p.id === selectedId && !p.locked
          ? { ...p, position: [newX, 0, newZ] }
          : p,
      ),
    )
  })

  const handlePointerUp = () => {
    if (!selectedId) return
    isDragging.current = false

    setPieces((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== selectedId || p.locked) return p
        const dx = Math.abs(p.position[0] - p.targetPosition[0])
        const dz = Math.abs(p.position[2] - p.targetPosition[2])
        if (dx < SNAP_THRESHOLD && dz < SNAP_THRESHOLD) {
          return { ...p, position: p.targetPosition as [number, number, number], locked: true }
        }
        return p
      })

      // Check win condition
      if (updated.every((p) => p.locked) && !solved) {
        setSolved(true)
        onSolved?.()
      }
      return updated
    })

    setSelectedId(null)
  }

  return (
    <>
      {/* Shadow floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.25} />
      </mesh>

      {pieces.map((piece) => (
        <PieceObject
          key={piece.id}
          piece={piece}
          config={config}
          texture={texture}
          isSelected={piece.id === selectedId}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        />
      ))}

      {solved && (
        <Html center>
          <div style={{
            background: 'rgba(5,5,10,0.92)',
            border: '1px solid rgba(99,102,241,0.6)',
            color: '#a5b4fc',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            padding: '1.2rem 2.4rem',
            textAlign: 'center',
          }}>
            ✓ PUZZLE SOLVED
          </div>
        </Html>
      )}
    </>
  )
}
