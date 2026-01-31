'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('My Garden')
  
  // Garden state
  const [seeds, setSeeds] = useState(3) // Start with 3 seeds for demo
  const [plots, setPlots] = useState([
    { id: 0, stage: 'empty', plantedAt: null },
    { id: 1, stage: 'empty', plantedAt: null },
    { id: 2, stage: 'empty', plantedAt: null },
    { id: 3, stage: 'empty', plantedAt: null },
    { id: 4, stage: 'empty', plantedAt: null },
    { id: 5, stage: 'empty', plantedAt: null },
    { id: 6, stage: 'empty', plantedAt: null },
    { id: 7, stage: 'empty', plantedAt: null },
  ])

  // Plant a seed in a plot
  const plantSeed = (plotId) => {
    if (seeds <= 0) {
      alert('No seeds available!')
      return
    }

    const plot = plots.find(p => p.id === plotId)
    if (plot.stage !== 'empty') {
      alert('This plot is already planted!')
      return
    }

    // Plant the seed
    setSeeds(seeds - 1)
    setPlots(plots.map(p => 
      p.id === plotId 
        ? { ...p, stage: 'sprouting', plantedAt: Date.now() }
        : p
    ))
  }

  // Get visual representation based on stage
  const getPlotVisual = (stage) => {
    switch(stage) {
      case 'empty':
        return '➕' // Plus sign for empty plot
      case 'sprouting':
        return <img src="/sprout.png" alt="Sprout" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
      case 'growing':
        return <img src="/growing.png" alt="Growing" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
      case 'grown':
        return <img src="/grown.png" alt="Flower" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
      default:
        return '➕'
    }
  }

  // All plots have grass background
  const getPlotStyle = (stage) => {
    return {
      backgroundColor: '#7cb342', // Grass green color
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)',
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div style={{ 
        borderBottom: '1px solid #ccc', 
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          <button 
            onClick={() => setActiveCategory('My Garden')}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: activeCategory === 'My Garden' ? 'bold' : 'normal',
              fontSize: '1rem'
            }}
          >
            My Garden
          </button>
          <button 
            onClick={() => setActiveCategory('Mailbox')}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: activeCategory === 'Mailbox' ? 'bold' : 'normal',
              fontSize: '1rem'
            }}
          >
            Mailbox
          </button>
          <button 
            onClick={() => setActiveCategory('My Account')}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: activeCategory === 'My Account' ? 'bold' : 'normal',
              fontSize: '1rem'
            }}
          >
            My Account
          </button>
        </div>

        {/* Seed counter */}
        <div style={{ 
          fontSize: '1.1rem', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🌰</span>
          <span>Seeds: {seeds}</span>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '2rem' }}>
        {activeCategory === 'My Garden' && (
          <div>
            <h1 style={{ marginBottom: '2rem' }}>My Garden</h1>
            
            {/* Instructions */}
            <p style={{ marginBottom: '2rem', color: '#666' }}>
              Click on an empty plot (➕) to plant a seed!
            </p>

            {/* Garden Grid - Single dirt background with 8 clickable plots */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              width: '100%',
              maxWidth: '680px',
              padding: '1.5rem',
              backgroundColor: '#8B7355',
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,.08) 3px, rgba(0,0,0,.08) 6px)',
              borderRadius: '16px',
              border: '3px solid #6B5644',
              boxSizing: 'border-box'
            }}>
              {plots.map(plot => {
                // Determine background based on growth stage
                let plotBg = 'transparent' // Empty - show dirt
                if (plot.stage === 'sprouting' || plot.stage === 'growing') {
                  // Partially green (grass growing)
                  plotBg = 'radial-gradient(circle, #7cb342 40%, transparent 70%)'
                } else if (plot.stage === 'grown') {
                  // Fully green
                  plotBg = '#7cb342'
                }

                return (
                  <div
                    key={plot.id}
                    onClick={() => plantSeed(plot.id)}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      maxWidth: '150px',
                      maxHeight: '150px',
                      background: plotBg,
                      border: plot.stage === 'empty' ? '2px dashed rgba(255,255,255,0.3)' : '2px solid #4f8f63',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      cursor: plot.stage === 'empty' ? 'pointer' : 'default',
                      transition: 'all 0.3s',
                      opacity: plot.stage === 'empty' ? 0.6 : 1,
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      if (plot.stage === 'empty') {
                        e.currentTarget.style.opacity = '1'
                        e.currentTarget.style.backgroundColor = 'rgba(139, 115, 85, 0.3)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (plot.stage === 'empty') {
                        e.currentTarget.style.opacity = '0.6'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    {getPlotVisual(plot.stage)}
                  </div>
                )
              })}
            </div>

            {/* Demo buttons to simulate growth (remove these later when you add real timers) */}
            <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '1rem' }}>🧪 Demo Controls (for testing)</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setSeeds(seeds + 1)}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#4f8f63', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer' 
                  }}
                >
                  Add Seed
                </button>
                <button 
                  onClick={() => {
                    // Advance all sprouting plants to growing
                    setPlots(plots.map(p => 
                      p.stage === 'sprouting' ? { ...p, stage: 'growing' } : p
                    ))
                  }}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#4f8f63', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer' 
                  }}
                >
                  Grow Sprouts
                </button>
                <button 
                  onClick={() => {
                    // Advance all growing plants to grown
                    setPlots(plots.map(p => 
                      p.stage === 'growing' ? { ...p, stage: 'grown' } : p
                    ))
                  }}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#4f8f63', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer' 
                  }}
                >
                  Bloom Plants
                </button>
                <button 
                  onClick={() => {
                    // Reset garden
                    setPlots(plots.map(p => ({ ...p, stage: 'empty', plantedAt: null })))
                    setSeeds(3)
                  }}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#666', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer' 
                  }}
                >
                  Reset Garden
                </button>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                These buttons simulate growth stages. Later, you'll replace this with actual timers.
              </p>
            </div>
          </div>
        )}
        
        {activeCategory === 'Mailbox' && (
          <div>
            <h1>Mailbox</h1>
            <p>Your mailbox content goes here</p>
          </div>
        )}
        
        {activeCategory === 'My Account' && (
          <div>
            <h1>My Account</h1>
            <p>Your account settings go here</p>
          </div>
        )}
      </div>
    </div>
  )
}