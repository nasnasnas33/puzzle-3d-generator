export interface JigsawConfig {
  /** Number of columns */
  cols: number
  /** Number of rows */
  rows: number
  /** Total board width in world units */
  width: number
  /** Total board height in world units */
  height: number
  /** Extrusion depth of each piece */
  depth: number
}

/**
 * Connector value: +1 = tab (protrudes), -1 = slot (recessed), 0 = flat (border)
 */
export interface PieceConnectors {
  top: number
  right: number
  bottom: number
  left: number
}

export interface JigsawPiece {
  id: string
  col: number
  row: number
  /** Initial (scattered) position [x, y, z] */
  position: [number, number, number]
  /** Solved position [x, y, z] */
  targetPosition: [number, number, number]
  /** UV coordinates mapping this piece to the source image */
  uv: { u0: number; u1: number; v0: number; v1: number }
  /** Edge connector shapes */
  connectors: PieceConnectors
  /** Whether this piece has been snapped into place */
  locked: boolean
}

/** Seeded pseudo-random number generator (deterministic per col/row) */
function seededRand(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

export function generateJigsawPieces(config: JigsawConfig): JigsawPiece[] {
  const { cols, rows, width, height } = config
  if (cols <= 0 || rows <= 0) return []

  const cellW = width / cols
  const cellH = height / rows

  // Pre-compute horizontal connectors (between col and col+1 for each row)
  // hConn[row][col] = connector value on right edge of piece[col, row]
  const hConn: number[][] = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols - 1 }, (_, col) => {
      const rand = seededRand(row * 1000 + col)
      return rand() > 0.5 ? 1 : -1
    }),
  )

  // Pre-compute vertical connectors (between row and row+1 for each col)
  // vConn[row][col] = connector value on bottom edge of piece[col, row]
  const vConn: number[][] = Array.from({ length: rows - 1 }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const rand = seededRand(col * 1000 + row + 500000)
      return rand() > 0.5 ? 1 : -1
    }),
  )

  const scatter = seededRand(42)
  const scatterRange = Math.max(width, height) * 0.8

  const pieces: JigsawPiece[] = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Target center position on board (XZ plane, Y=0)
      const tx = -width / 2 + cellW * (col + 0.5)
      const tz = -height / 2 + cellH * (row + 0.5)

      // Scattered initial position
      const sx = tx + (scatter() - 0.5) * scatterRange
      const sz = tz + (scatter() - 0.5) * scatterRange

      // UV bounds
      const u0 = col / cols
      const u1 = (col + 1) / cols
      const v0 = row / rows
      const v1 = (row + 1) / rows

      // Connectors
      const right = col < cols - 1 ? hConn[row][col] : 0
      const left = col > 0 ? -hConn[row][col - 1] : 0
      const bottom = row < rows - 1 ? vConn[row][col] : 0
      const top = row > 0 ? -vConn[row - 1][col] : 0

      pieces.push({
        id: `piece-${col}-${row}`,
        col,
        row,
        position: [sx, 0, sz],
        targetPosition: [tx, 0, tz],
        uv: { u0, u1, v0, v1 },
        connectors: { top, right, bottom, left },
        locked: false,
      })
    }
  }

  return pieces
}
