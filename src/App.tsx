import { useState } from 'react'
import { LandingPage } from './components/LandingPage'

type PuzzleMode = 'home' | 'jigsaw' | 'geometry'

function App() {
  const [mode, setMode] = useState<PuzzleMode>('home')

  return (
    <>
      {mode === 'home' && (
        <LandingPage onSelectMode={(m) => setMode(m)} />
      )}
      {mode !== 'home' && (
        <div
          style={{
            minHeight: '100vh',
            background: '#05050a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            fontFamily: "'DM Mono', monospace",
            color: '#9ca3c4',
          }}
        >
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            {mode === 'jigsaw' ? '⬡ Jigsaw puzzle coming soon…' : '◈ Geometry puzzle coming soon…'}
          </p>
          <button
            onClick={() => setMode('home')}
            style={{
              background: 'none',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#818cf8',
              padding: '0.5rem 1.2rem',
              cursor: 'pointer',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'inherit',
            }}
          >
            ← Back
          </button>
        </div>
      )}
    </>
  )
}

export default App
