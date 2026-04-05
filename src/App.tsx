import { useState } from 'react'

type PuzzleMode = 'home' | 'jigsaw' | 'geometry'

function App() {
  const [mode, setMode] = useState<PuzzleMode>('home')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {mode === 'home' && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
          <h1 className="text-5xl font-bold tracking-tight">3D Puzzle Generator</h1>
          <p className="text-gray-400 text-lg">Choose a puzzle type to get started</p>
          <div className="flex gap-6">
            <button
              onClick={() => setMode('jigsaw')}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-lg transition-colors"
            >
              Jigsaw Puzzle
            </button>
            <button
              onClick={() => setMode('geometry')}
              className="px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-lg transition-colors"
            >
              Custom Geometry
            </button>
          </div>
        </div>
      )}
      {mode !== 'home' && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-gray-400">
            {mode === 'jigsaw' ? 'Jigsaw puzzle coming soon…' : 'Geometry puzzle coming soon…'}
          </p>
          <button
            onClick={() => setMode('home')}
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            Back
          </button>
        </div>
      )}
    </div>
  )
}

export default App
