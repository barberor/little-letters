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

  // Mailbox state
  const [messages, setMessages] = useState([
    { id: 0, isOpen: false, from: 'Dr. Sarah Johnson', subject: 'Welcome to the mentorship program!' },
    { id: 1, isOpen: false, from: 'System', subject: 'You earned 3 seeds!' },
    { id: 2, isOpen: true, from: 'Dr. Sarah Johnson', subject: 'Great progress this week' },
    { id: 3, isOpen: false, from: 'Community', subject: 'New achievement unlocked' },
    { id: 4, isOpen: false, from: 'Dr. Sarah Johnson', subject: 'Tips for your garden' },
    { id: 5, isOpen: true, from: 'System', subject: 'Weekly summary' },
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

  // Toggle message open/closed
  const toggleMessage = (messageId) => {
    setMessages(messages.map(m => 
      m.id === messageId 
        ? { ...m, isOpen: !m.isOpen }
        : m
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
        return <img src="/grown.png" alt="Grown" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
      default:
        return '➕'
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
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            {/* Left Side - Garden */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h1 style={{ marginBottom: '2rem' }}>My Garden</h1>
              
              {/* Instructions */}
              <p style={{ marginBottom: '2rem', color: '#666' }}>
                Click on an empty plot (➕) to plant a seed!
              </p>

              {/* Garden Grid - Green grass surrounding area with brown dirt plots */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                width: '100%',
                maxWidth: '680px',
                padding: '1.5rem',
                backgroundColor: '#7cb342', // Green grass between plots
                borderRadius: '16px',
                border: '3px solid rgb(151, 95, 62)',
                boxSizing: 'border-box'
              }}>
                {plots.map(plot => {
                  return (
                    <div
                      key={plot.id}
                      onClick={() => plantSeed(plot.id)}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        maxWidth: '150px',
                        maxHeight: '150px',
                        backgroundColor: 'rgb(151, 95, 62)', // Exact brown dirt color
                        border: `3px solid rgb(151, 95, 62)`,
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
                          e.currentTarget.style.transform = 'scale(1.02)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (plot.stage === 'empty') {
                          e.currentTarget.style.opacity = '0.6'
                          e.currentTarget.style.transform = 'scale(1)'
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

            {/* Right Side - Mentor Information */}
            <div style={{ 
              width: '350px',
              padding: '1.5rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '12px',
              border: '2px solid #e0e0e0'
            }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>My Mentor</h2>
              
              {/* Mentor Profile Image */}
              <div style={{ 
                width: '100%',
                aspectRatio: '1',
                backgroundColor: '#ddd',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src="/mentor-demo.png" 
                  alt="Mentor" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              </div>

              {/* Mentor Name */}
              <h3 style={{ 
                fontSize: '1.3rem', 
                marginBottom: '0.5rem',
                fontWeight: 'bold'
              }}>
                Dr. Sarah Johnson
              </h3>

              {/* Mentor Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ 
                  fontSize: '0.9rem', 
                  color: '#666', 
                  marginBottom: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  About
                </h4>
                <p style={{ 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6',
                  color: '#444'
                }}>
                  Dr. Johnson is a marine biologist with over 15 years of experience studying coral reef ecosystems. She's passionate about environmental conservation and loves sharing her knowledge with the next generation of scientists.
                </p>
              </div>

              {/* Mentor Interests */}
              <div>
                <h4 style={{ 
                  fontSize: '0.9rem', 
                  color: '#666', 
                  marginBottom: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Interests
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ 
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    borderRadius: '20px',
                    fontSize: '0.85rem'
                  }}>
                    Marine Biology
                  </span>
                  <span style={{ 
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#e8f5e9',
                    color: '#388e3c',
                    borderRadius: '20px',
                    fontSize: '0.85rem'
                  }}>
                    Conservation
                  </span>
                  <span style={{ 
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#fff3e0',
                    color: '#f57c00',
                    borderRadius: '20px',
                    fontSize: '0.85rem'
                  }}>
                    Scuba Diving
                  </span>
                  <span style={{ 
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#fce4ec',
                    color: '#c2185b',
                    borderRadius: '20px',
                    fontSize: '0.85rem'
                  }}>
                    Photography
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeCategory === 'Mailbox' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ marginBottom: '2rem' }}>Mailbox</h1>
            
            {/* Envelope Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '2rem',
              width: '100%',
              maxWidth: '1200px',
              padding: '1rem'
            }}>
              {messages.map(message => (
                <div
                  key={message.id}
                  onClick={() => toggleMessage(message.id)}
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* Envelope Image */}
                  <div style={{
                    width: '200px',
                    height: '150px',
                    backgroundColor: message.isOpen ? '#f0f0f0' : '#fff3e0',
                    border: '2px solid #ccc',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={message.isOpen ? '/envelope-open.png' : '/envelope-closed.png'} 
                      alt={message.isOpen ? 'Open envelope' : 'Closed envelope'}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain' 
                      }} 
                    />
                  </div>

                  {/* Message Info */}
                  <div style={{ 
                    textAlign: 'center',
                    width: '100%'
                  }}>
                    <p style={{ 
                      fontWeight: 'bold', 
                      fontSize: '0.9rem',
                      marginBottom: '0.25rem',
                      color: '#333'
                    }}>
                      From: {message.from}
                    </p>
                    <p style={{ 
                      fontSize: '0.85rem',
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      {message.subject}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo button to add test messages */}
            <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '1rem' }}>🧪 Demo Controls (for testing)</h3>
              <button 
                onClick={() => {
                  const newId = messages.length
                  setMessages([...messages, {
                    id: newId,
                    isOpen: false,
                    from: 'Test Sender',
                    subject: 'Test message #' + (newId + 1)
                  }])
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
                Add Test Message
              </button>
            </div>
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