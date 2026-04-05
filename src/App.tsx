import React, { useState } from 'react'
import { LandingPage } from './components/LandingPage'
import { PuzzleCanvas } from './components/canvas/PuzzleCanvas'
import { JigsawPuzzle } from './components/puzzles/JigsawPuzzle'
import { JigsawUploader } from './components/puzzles/JigsawUploader'
import { GeometryPuzzle } from './components/puzzles/GeometryPuzzle'
import { GeometryPicker } from './components/puzzles/GeometryPicker'
import { type ShapeType } from './lib/geometry/exploder'

type PuzzleMode = 'home' | 'jigsaw' | 'geometry'

function ZoomSlider({ zoom, onChange }: { zoom: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <style>{`
        .zoom-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 90px;
          height: 2px;
          background: rgba(99,102,241,0.3);
          outline: none;
          cursor: pointer;
        }
        .zoom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: #6366f1;
          border-radius: 50%;
          border: none;
        }
        .zoom-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #6366f1;
          border-radius: 50%;
          border: none;
        }
      `}</style>
      <span style={{ color: '#4b5563', fontSize: '0.6rem', letterSpacing: '0.1em' }}>
        zoom
      </span>
      <input
        type="range"
        className="zoom-slider"
        min={6}
        max={30}
        value={zoom}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

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
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null)
  const [jigsawZoom, setJigsawZoom] = useState(14)
  const [geometryZoom, setGeometryZoom] = useState(12)

  return (
    <>
      {mode === 'home' && (
        <LandingPage onSelectMode={(m) => setMode(m)} />
      )}
      {mode === 'jigsaw' && (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          {jigsawImageUrl ? (
            <PuzzleCanvas zoom={jigsawZoom}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', pointerEvents: 'auto' }}>
              {jigsawImageUrl && <ZoomSlider zoom={jigsawZoom} onChange={setJigsawZoom} />}
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
          {selectedShape ? (
            <PuzzleCanvas zoom={geometryZoom}>
              <GeometryPuzzle
                shape={selectedShape}
                shardCount={10}
                onSolved={() => console.log('Geometry solved!')}
              />
            </PuzzleCanvas>
          ) : (
            <GeometryPicker onSelect={(s) => setSelectedShape(s)} />
          )}

          {/* HUD */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            padding: '1rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(5,5,10,0.85) 0%, transparent 100%)',
            fontFamily: "'DM Mono', monospace",
            pointerEvents: selectedShape ? 'auto' : 'none',
          }}>
            <span style={{ color: '#a78bfa', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              ◈ Custom Geometry
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', pointerEvents: 'auto' }}>
              {selectedShape && <ZoomSlider zoom={geometryZoom} onChange={setGeometryZoom} />}
              {selectedShape && (
                <button onClick={() => setSelectedShape(null)} style={hudBtnStyle}>
                  ↺ Change Shape
                </button>
              )}
              <button onClick={() => { setMode('home'); setSelectedShape(null) }} style={hudBtnStyle}>
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
