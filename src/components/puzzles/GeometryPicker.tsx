import { SHAPE_CONFIGS, type ShapeType } from '../../lib/geometry/exploder'

interface GeometryPickerProps {
  onSelect: (shape: ShapeType) => void
}

const SHAPE_ICONS: Record<ShapeType, string> = {
  sphere:      '●',
  icosahedron: '◆',
  torus:       '◎',
  octahedron:  '◈',
}

export function GeometryPicker({ onSelect }: GeometryPickerProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#05050a',
      fontFamily: "'DM Mono', monospace",
      gap: '2.5rem',
      padding: '2rem',
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#8b5cf6', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          // custom geometry
        </p>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '2.5rem',
          color: '#e8e8f0',
          letterSpacing: '0.06em',
          lineHeight: 1,
          marginBottom: '0.5rem',
        }}>
          Choose a Shape
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.75rem', letterSpacing: '0.03em' }}>
          The shape will explode into shards — reassemble it to win
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        width: '100%',
        maxWidth: '420px',
      }}>
        {(Object.keys(SHAPE_CONFIGS) as ShapeType[]).map((shape) => (
          <button
            key={shape}
            onClick={() => onSelect(shape)}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#c4b5fd',
              padding: '2rem 1rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = 'rgba(139,92,246,0.6)'
              el.style.background = 'rgba(139,92,246,0.06)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = 'rgba(139,92,246,0.25)'
              el.style.background = 'rgba(255,255,255,0.02)'
            }}
          >
            <span style={{ fontSize: '2rem', lineHeight: 1, color: SHAPE_CONFIGS[shape].color }}>
              {SHAPE_ICONS[shape]}
            </span>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.1rem',
              letterSpacing: '0.1em',
              color: '#e8e8f0',
            }}>
              {SHAPE_CONFIGS[shape].label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
