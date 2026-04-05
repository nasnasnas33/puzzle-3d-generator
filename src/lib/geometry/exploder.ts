export interface ExploderConfig {
  shardCount: number
  spreadRadius: number
  seed: number
}

export interface GeometryShard {
  id: string
  /** Explosion-scattered position */
  position: [number, number, number]
  /** Target position to reassemble */
  targetPosition: [number, number, number]
  /** Target rotation (euler XYZ) */
  targetRotation: [number, number, number]
  /** Current rotation */
  rotation: [number, number, number]
  /** Scale of the shard piece */
  scale: number
  /** Colour tint index for visual variety */
  colorIndex: number
  locked: boolean
}

export const SHAPE_CONFIGS = {
  sphere:       { label: 'Sphere',       color: '#6366f1' },
  icosahedron:  { label: 'Icosahedron',  color: '#8b5cf6' },
  torus:        { label: 'Torus',        color: '#a78bfa' },
  octahedron:   { label: 'Octahedron',   color: '#7c3aed' },
} as const

export type ShapeType = keyof typeof SHAPE_CONFIGS

/** Seeded PRNG — same interface as generator.ts */
function seededRand(seed: number) {
  let s = seed | 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0
    return (s >>> 0) / 0xffffffff
  }
}

/**
 * Generates shard descriptors for the geometry puzzle.
 * Target positions cluster near origin (as if assembled); scattered
 * positions are displaced outward by spreadRadius.
 */
export function explodeMesh(shape: ShapeType, config: ExploderConfig): GeometryShard[] {
  const { shardCount, spreadRadius, seed } = config
  const rand = seededRand(seed)

  const shards: GeometryShard[] = []

  for (let i = 0; i < shardCount; i++) {
    // Target: evenly distribute on a small sphere around origin
    const theta = Math.acos(2 * (i / shardCount) - 1)
    const phi = (i * 2.399963) % (2 * Math.PI) // golden angle

    const r = 0.6 + rand() * 0.8
    const tx = r * Math.sin(theta) * Math.cos(phi)
    const ty = r * Math.cos(theta)
    const tz = r * Math.sin(theta) * Math.sin(phi)

    // Scattered: push outward from target in random direction
    const sx = tx + (rand() - 0.5) * spreadRadius * 2
    const sy = ty + (rand() - 0.5) * spreadRadius * 2
    const sz = tz + (rand() - 0.5) * spreadRadius * 2

    const targetRot: [number, number, number] = [0, 0, 0]
    const scatteredRot: [number, number, number] = [
      rand() * Math.PI * 2,
      rand() * Math.PI * 2,
      rand() * Math.PI * 2,
    ]

    shards.push({
      id: `${shape}-shard-${i}`,
      position: [sx, sy, sz],
      targetPosition: [tx, ty, tz],
      targetRotation: targetRot,
      rotation: scatteredRot,
      scale: 0.55 + rand() * 0.35,
      colorIndex: i % 4,
      locked: false,
    })
  }

  return shards
}
