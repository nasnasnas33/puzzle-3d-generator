import { describe, it, expect } from 'vitest'
import { explodeMesh, SHAPE_CONFIGS, type ExploderConfig } from './exploder'

const BASE_CONFIG: ExploderConfig = {
  shardCount: 8,
  spreadRadius: 4,
  seed: 1,
}

describe('explodeMesh', () => {
  it('produces exactly shardCount shards', () => {
    const shards = explodeMesh('icosahedron', BASE_CONFIG)
    expect(shards).toHaveLength(BASE_CONFIG.shardCount)
  })

  it('each shard has a unique id', () => {
    const shards = explodeMesh('icosahedron', BASE_CONFIG)
    const ids = shards.map((s) => s.id)
    expect(new Set(ids).size).toBe(shards.length)
  })

  it('each shard has a target position (origin region)', () => {
    const shards = explodeMesh('icosahedron', BASE_CONFIG)
    for (const shard of shards) {
      // target position should be close to origin (within shape radius)
      const dist = Math.sqrt(
        shard.targetPosition[0] ** 2 +
        shard.targetPosition[1] ** 2 +
        shard.targetPosition[2] ** 2,
      )
      expect(dist).toBeLessThan(3)
    }
  })

  it('scattered positions are displaced from target by up to spreadRadius', () => {
    const shards = explodeMesh('icosahedron', BASE_CONFIG)
    for (const shard of shards) {
      const dx = shard.position[0] - shard.targetPosition[0]
      const dy = shard.position[1] - shard.targetPosition[1]
      const dz = shard.position[2] - shard.targetPosition[2]
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      expect(dist).toBeLessThanOrEqual(BASE_CONFIG.spreadRadius * 1.5)
    }
  })

  it('is deterministic with the same seed', () => {
    const a = explodeMesh('sphere', BASE_CONFIG)
    const b = explodeMesh('sphere', BASE_CONFIG)
    expect(a.map((s) => s.position)).toEqual(b.map((s) => s.position))
  })

  it('produces different layouts with different seeds', () => {
    const a = explodeMesh('sphere', { ...BASE_CONFIG, seed: 1 })
    const b = explodeMesh('sphere', { ...BASE_CONFIG, seed: 2 })
    const same = a.every((s, i) => s.position[0] === b[i].position[0])
    expect(same).toBe(false)
  })

  it('works for all supported shape types', () => {
    for (const shape of Object.keys(SHAPE_CONFIGS)) {
      const shards = explodeMesh(shape as keyof typeof SHAPE_CONFIGS, BASE_CONFIG)
      expect(shards.length).toBe(BASE_CONFIG.shardCount)
    }
  })

  it('each shard starts unlocked', () => {
    const shards = explodeMesh('torus', BASE_CONFIG)
    expect(shards.every((s) => !s.locked)).toBe(true)
  })
})
