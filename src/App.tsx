import React, { useState } from 'react'
import { LandingPage } from './components/LandingPage'
import { PuzzleCanvas } from './components/canvas/PuzzleCanvas'
import { DemoScene } from './components/canvas/DemoScene'
import { JigsawPuzzle } from './components/puzzles/JigsawPuzzle'
import { JigsawUploader } from './components/puzzles/JigsawUploader'

type PuzzleMode = 'home' | 'jigsaw' | 'geometry'

const hudBtnStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid rgba(99,102,241,0.3)',
  color: '#818cf8',
  padding: '0.4rem 1rem',
  cursor: 'pointer',
  fontSize: '0.65rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  fontFamily: "'DM Mono', monospace",
}

function App() {
  const [mode, setMode] = useState<PuzzleMode>('home')
  const [jigsawImageUrl, setJigsawImageUrl] = useState<string | null>(null)

  return (
    <>
      {mode === 'home' && (
        <LandingPage onSelectMode={(m) => setMode(m)} />
      )}
      {mode === 'jigsaw' && (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          {jigsawImageUrl ? (
            <PuzzleCanvas cameraPosition={[0, 12, 16]}>
              <JigsawPuzzle
                imageUrl={jigsawImageUrl}
                cols={4}
                rows={3}
                onSolved={() => console.log('Jigsaw solved!')}
              />
            </PuzzleCanvas>
          ) : (
            <JigsawUploader onImage={(url) => setJigsawImageUrl(url)} />
          )}

          {/* HUD */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            padding: '1rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(5,5,10,0.85) 0%, transparent 100%)',
            fontFamily: "'DM Mono', monospace",
            pointerEvents: jigsawImageUrl ? 'auto' : 'none',
          }}>
            <span style={{ color: '#818cf8', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              ⬡ Jigsaw Puzzle
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', pointerEvents: 'auto' }}>
              {jigsawImageUrl && (
                <button onClick={() => setJigsawImageUrl(null)} style={hudBtnStyle}>
                  ↺ New Image
                </button>
              )}
              <button onClick={() => { setMode('home'); setJigsawImageUrl(null) }} style={hudBtnStyle}>
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'geometry' && (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <PuzzleCanvas>
            <DemoScene />
          </PuzzleCanvas>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            padding: '1rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(5,5,10,0.85) 0%, transparent 100%)',
            fontFamily: "'DM Mono', monospace",
          }}>
            <span style={{ color: '#818cf8', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              ◈ Custom Geometry
            </span>
            <button onClick={() => setMode('home')} style={hudBtnStyle}>← Back</button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
