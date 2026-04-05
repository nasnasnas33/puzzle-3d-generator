import { describe, it, expect } from 'vitest'
import { generateJigsawPieces, type JigsawConfig } from './generator'

const BASE_CONFIG: JigsawConfig = {
  cols: 4,
  rows: 3,
  width: 8,
  height: 6,
  depth: 0.3,
}

describe('generateJigsawPieces', () => {
  it('produces cols × rows pieces', () => {
    const pieces = generateJigsawPieces(BASE_CONFIG)
    expect(pieces).toHaveLength(BASE_CONFIG.cols * BASE_CONFIG.rows)
  })

  it('each piece has a unique id', () => {
    const pieces = generateJigsawPieces(BASE_CONFIG)
    const ids = pieces.map((p) => p.id)
    expect(new Set(ids).size).toBe(pieces.length)
  })

  it('each piece carries correct grid col/row', () => {
    const pieces = generateJigsawPieces(BASE_CONFIG)
    for (const piece of pieces) {
      expect(piece.col).toBeGreaterThanOrEqual(0)
      expect(piece.col).toBeLessThan(BASE_CONFIG.cols)
      expect(piece.row).toBeGreaterThanOrEqual(0)
      expect(piece.row).toBeLessThan(BASE_CONFIG.rows)
    }
  })

  it('each piece has a target position inside the board bounds', () => {
    const pieces = generateJigsawPieces(BASE_CONFIG)
    const halfW = BASE_CONFIG.width / 2
    const halfH = BASE_CONFIG.height / 2
    for (const piece of pieces) {
      expect(piece.targetPosition[0]).toBeGreaterThanOrEqual(-halfW)
      expect(piece.targetPosition[0]).toBeLessThanOrEqual(halfW)
      expect(piece.targetPosition[2]).toBeGreaterThanOrEqual(-halfH)
      expect(piece.targetPosition[2]).toBeLessThanOrEqual(halfH)
    }
  })

  it('each piece has a scattered initial position different from target', () => {
    const pieces = generateJigsawPieces(BASE_CONFIG)
    // At least some pieces should be displaced from target
    const displaced = pieces.filter((p) => {
      const dx = Math.abs(p.position[0] - p.targetPosition[0])
      const dz = Math.abs(p.position[2] - p.targetPosition[2])
      return dx > 0.01 || dz > 0.01
    })
    expect(displaced.length).toBeGreaterThan(0)
  })

  it('UV bounds cover [0,1] range collectively', () => {
    const pieces = generateJigsawPieces(BASE_CONFIG)
    const allU = pieces.flatMap((p) => [p.uv.u0, p.uv.u1])
    const allV = pieces.flatMap((p) => [p.uv.v0, p.uv.v1])
    expect(Math.min(...allU)).toBeCloseTo(0, 5)
    expect(Math.max(...allU)).toBeCloseTo(1, 5)
    expect(Math.min(...allV)).toBeCloseTo(0, 5)
    expect(Math.max(...allV)).toBeCloseTo(1, 5)
  })

  it('adjacent pieces have complementary tab/slot connectors', () => {
    const pieces = generateJigsawPieces(BASE_CONFIG)
    const get = (col: number, row: number) =>
      pieces.find((p) => p.col === col && p.row === row)!

    // Right edge of piece[0,0] should be opposite of left edge of piece[1,0]
    const p00 = get(0, 0)
    const p10 = get(1, 0)
    expect(p00.connectors.right).toBe(-p10.connectors.left)
  })

  it('returns empty array for zero-dimension config', () => {
    const pieces = generateJigsawPieces({ ...BASE_CONFIG, cols: 0, rows: 0 })
    expect(pieces).toHaveLength(0)
  })
})
