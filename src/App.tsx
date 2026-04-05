import { useState } from 'react'
import { LandingPage } from './components/LandingPage'
import { PuzzleCanvas } from './components/canvas/PuzzleCanvas'
import { DemoScene } from './components/canvas/DemoScene'

type PuzzleMode = 'home' | 'jigsaw' | 'geometry'

function App() {
  const [mode, setMode] = useState<PuzzleMode>('home')

  return (
    <>
      {mode === 'home' && (
        <LandingPage onSelectMode={(m) => setMode(m)} />
      )}
      {mode !== 'home' && (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <PuzzleCanvas>
            <DemoScene />
          </PuzzleCanvas>

          {/* HUD overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, rgba(5,5,10,0.85) 0%, transparent 100%)',
              fontFamily: "'DM Mono', monospace",
            }}
          >
            <span style={{ color: '#818cf8', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {mode === 'jigsaw' ? '⬡ Jigsaw Puzzle' : '◈ Custom Geometry'}
            </span>
            <button
              onClick={() => setMode('home')}
              style={{
                background: 'none',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#818cf8',
                padding: '0.4rem 1rem',
                cursor: 'pointer',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'inherit',
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
