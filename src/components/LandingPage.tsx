import { useEffect, useRef } from 'react'

type PuzzleMode = 'jigsaw' | 'geometry'

interface LandingPageProps {
  onSelectMode: (mode: PuzzleMode) => void
}

const HEADLINE = '3D PUZZLE GENERATOR'

export function LandingPage({ onSelectMode }: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  // Subtle parallax on mouse move
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window
      const x = (e.clientX / w - 0.5) * 20
      const y = (e.clientY / h - 0.5) * 20
      el.style.setProperty('--px', `${x}px`)
      el.style.setProperty('--py', `${y}px`)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .landing-root {
          font-family: 'DM Mono', monospace;
          background: #05050a;
          color: #e8e8f0;
          min-height: 100vh;
        }

        /* dot-grid background */
        .dot-grid {
          background-image: radial-gradient(circle, rgba(99,102,241,0.18) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          transition: transform 0.4s ease-out;
          transform: translate(var(--px, 0), var(--py, 0));
        }

        /* Staggered headline reveal */
        .headline-char {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px) skewX(-6deg);
          animation: charReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes charReveal {
          to { opacity: 1; transform: translateY(0) skewX(0deg); }
        }

        .hero-sub {
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.7s 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .hero-ctas {
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.7s 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* CTA buttons */
        .btn-jigsaw {
          position: relative;
          padding: 0.85rem 2.4rem;
          background: transparent;
          border: 1.5px solid #6366f1;
          color: #a5b4fc;
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }
        .btn-jigsaw::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .btn-jigsaw:hover::before { opacity: 1; }
        .btn-jigsaw:hover {
          color: #fff;
          box-shadow: 0 0 24px rgba(99,102,241,0.5);
        }
        .btn-jigsaw span { position: relative; z-index: 1; }

        .btn-geometry {
          position: relative;
          padding: 0.85rem 2.4rem;
          background: transparent;
          border: 1.5px solid #8b5cf6;
          color: #c4b5fd;
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }
        .btn-geometry::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .btn-geometry:hover::before { opacity: 1; }
        .btn-geometry:hover {
          color: #fff;
          box-shadow: 0 0 24px rgba(139,92,246,0.5);
        }
        .btn-geometry span { position: relative; z-index: 1; }

        /* Feature cards */
        .feat-card {
          border: 1px solid rgba(99,102,241,0.2);
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(4px);
          padding: 2rem 1.75rem;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .feat-card:hover {
          border-color: rgba(139,92,246,0.5);
          box-shadow: 0 0 32px rgba(99,102,241,0.12), inset 0 0 24px rgba(139,92,246,0.04);
          transform: translateY(-4px);
        }

        /* scanline overlay on hero headline */
        .scanline-text {
          position: relative;
        }
        .scanline-text::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(5,5,10,0.08) 3px,
            rgba(5,5,10,0.08) 4px
          );
          pointer-events: none;
        }

        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(139,92,246,0.4), transparent);
        }

        .tag-pill {
          display: inline-block;
          border: 1px solid rgba(99,102,241,0.3);
          color: #818cf8;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.3rem 0.8rem;
          margin-bottom: 2rem;
          opacity: 0;
          animation: fadeUp 0.5s 0.3s ease forwards;
        }
      `}</style>

      <div className="landing-root">
        {/* ── Hero ── */}
        <section
          className="dot-grid relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden"
          ref={heroRef}
          style={{ ['--px' as string]: '0px', ['--py' as string]: '0px' }}
        >
          {/* Ambient orbs */}
          <div
            className="hero-orb"
            style={{
              width: 600,
              height: 600,
              background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
              top: '10%',
              left: '10%',
            }}
          />
          <div
            className="hero-orb"
            style={{
              width: 500,
              height: 500,
              background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
              bottom: '5%',
              right: '8%',
              animationDelay: '0.2s',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="tag-pill">// interactive · generative · browser-native</div>

            {/* Staggered headline */}
            <h1
              className="scanline-text"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                lineHeight: 0.9,
                letterSpacing: '0.04em',
                background: 'linear-gradient(135deg, #e8e8f0 30%, #a5b4fc 60%, #c4b5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1.5rem',
              }}
            >
              {HEADLINE.split('').map((char, i) => (
                <span
                  key={i}
                  className="headline-char"
                  style={{ animationDelay: `${0.4 + i * 0.03}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>

            <p
              className="hero-sub"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                color: '#9ca3c4',
                letterSpacing: '0.04em',
                maxWidth: '480px',
                margin: '0 auto 2.5rem',
                lineHeight: 1.7,
              }}
            >
              Generate and solve interactive 3D puzzles in your browser.
              <br />
              No plugins. No installs. Pure WebGL.
            </p>

            <div className="hero-ctas" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-jigsaw" onClick={() => onSelectMode('jigsaw')}>
                <span>⬡ Jigsaw Puzzle</span>
              </button>
              <button className="btn-geometry" onClick={() => onSelectMode('geometry')}>
                <span>◈ Custom Geometry</span>
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              opacity: 0.35,
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              color: '#818cf8',
              textTransform: 'uppercase',
            }}
          >
            <span>scroll</span>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <rect x="1" y="1" width="10" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="6" cy="6" r="2" fill="currentColor">
                <animate attributeName="cy" values="6;12;6" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="divider-line" />

        {/* ── Feature strip ── */}
        <section className="px-6 py-24" style={{ background: '#07070e' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.25em',
                color: '#6366f1',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: '3rem',
              }}
            >
              — capabilities —
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5px',
                background: 'rgba(99,102,241,0.08)',
              }}
            >
              {/* Card 1 */}
              <div className="feat-card" style={{ background: '#07070e' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginBottom: '1.25rem' }}>
                  <path d="M4 14L14 4L24 14L14 24L4 14Z" stroke="#6366f1" strokeWidth="1.5" />
                  <path d="M9 14L14 9L19 14L14 19L9 14Z" fill="rgba(99,102,241,0.3)" stroke="#818cf8" strokeWidth="1" />
                </svg>
                <h3
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.4rem',
                    letterSpacing: '0.08em',
                    color: '#e8e8f0',
                    marginBottom: '0.6rem',
                  }}
                >
                  Interactive 3D
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.7, letterSpacing: '0.02em' }}>
                  Full WebGL rendering via Three.js. Drag, rotate, and snap pieces with real-time physics-informed feedback.
                </p>
              </div>

              {/* Card 2 */}
              <div className="feat-card" style={{ background: '#07070e' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginBottom: '1.25rem' }}>
                  <rect x="3" y="3" width="10" height="10" rx="1" stroke="#8b5cf6" strokeWidth="1.5" />
                  <rect x="15" y="15" width="10" height="10" rx="1" stroke="#6366f1" strokeWidth="1.5" />
                  <path d="M13 8H15M20 13V15" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <h3
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.4rem',
                    letterSpacing: '0.08em',
                    color: '#e8e8f0',
                    marginBottom: '0.6rem',
                  }}
                >
                  Two Puzzle Types
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.7, letterSpacing: '0.02em' }}>
                  Slice any image into interlocking 3D jigsaw pieces, or fracture geometric shapes into Voronoi shards.
                </p>
              </div>

              {/* Card 3 */}
              <div className="feat-card" style={{ background: '#07070e' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginBottom: '1.25rem' }}>
                  <circle cx="14" cy="14" r="10" stroke="#6366f1" strokeWidth="1.5" />
                  <path d="M10 14L13 17L18 11" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.4rem',
                    letterSpacing: '0.08em',
                    color: '#e8e8f0',
                    marginBottom: '0.6rem',
                  }}
                >
                  Browser Native
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.7, letterSpacing: '0.02em' }}>
                  Zero install. Zero plugins. Runs entirely in-browser using WebGL — works on desktop and mobile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <div className="divider-line" />
        <footer
          style={{
            background: '#05050a',
            padding: '1.5rem',
            textAlign: 'center',
            fontSize: '0.6rem',
            color: '#374151',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          3D Puzzle Generator · Built with React + Three.js
        </footer>
      </div>
    </>
  )
}
