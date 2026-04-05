import { useRef, useState } from 'react'

interface JigsawUploaderProps {
  onImage: (url: string) => void
}

const DEMO_IMAGES = [
  { label: 'Mountains', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },
  { label: 'Ocean', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80' },
  { label: 'Forest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80' },
]

export function JigsawUploader({ onImage }: JigsawUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    onImage(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

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
      gap: '2rem',
      padding: '2rem',
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6366f1', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          // jigsaw puzzle
        </p>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '2.5rem',
          color: '#e8e8f0',
          letterSpacing: '0.06em',
          lineHeight: 1,
          marginBottom: '0.5rem',
        }}>
          Upload an Image
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.75rem', letterSpacing: '0.03em' }}>
          Your image will be sliced into 3D interlocking puzzle pieces
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          width: '100%',
          maxWidth: '420px',
          border: `1.5px dashed ${dragging ? '#6366f1' : 'rgba(99,102,241,0.3)'}`,
          background: dragging ? 'rgba(99,102,241,0.06)' : 'transparent',
          padding: '3rem 2rem',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'border-color 0.2s, background 0.2s',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto 1rem' }}>
          <path d="M18 4V22M18 4L12 10M18 4L24 10" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 28H30" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 20V28H30V20" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p style={{ color: '#9ca3c4', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          Drop image here or <span style={{ color: '#818cf8' }}>click to browse</span>
        </p>
        <p style={{ color: '#374151', fontSize: '0.65rem', marginTop: '0.5rem' }}>PNG, JPG, WEBP</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </div>

      {/* Demo images */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#374151', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          — or try a demo —
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {DEMO_IMAGES.map((img) => (
            <button
              key={img.label}
              onClick={() => onImage(img.url)}
              style={{
                background: 'none',
                border: '1px solid rgba(99,102,241,0.25)',
                color: '#818cf8',
                padding: '0.45rem 1rem',
                cursor: 'pointer',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.6)'
                ;(e.currentTarget as HTMLElement).style.color = '#a5b4fc'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.25)'
                ;(e.currentTarget as HTMLElement).style.color = '#818cf8'
              }}
            >
              {img.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
