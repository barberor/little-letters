'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('My Garden')
  
  // Garden state
  const [seeds, setSeeds] = useState(3)
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
    { id: 0, isOpen: false, from: 'Dr. Sarah Johnson', subject: 'Welcome to the mentorship program!', content: 'Welcome to our mentorship program! I\'m excited to be your mentor and help you grow in your learning journey.' },
    { id: 1, isOpen: false, from: 'System', subject: 'You earned 3 seeds!', content: 'Congratulations! You\'ve earned 3 seeds for completing your first week. Plant them in your garden!' },
    { id: 2, isOpen: true, from: 'Dr. Sarah Johnson', subject: 'Great progress this week', content: 'I\'ve noticed your great progress this week. Keep up the excellent work!' },
    { id: 3, isOpen: false, from: 'Community', subject: 'New achievement unlocked', content: 'You\'ve unlocked a new achievement! Your dedication is paying off.' },
    { id: 4, isOpen: false, from: 'Dr. Sarah Johnson', subject: 'Tips for your garden', content: 'Here are some tips to help your garden flourish. Remember to check on your plants regularly!' },
    { id: 5, isOpen: true, from: 'System', subject: 'Weekly summary', content: 'Here\'s your weekly summary of activities and achievements.' },
  ])

  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showSeedAnimation, setShowSeedAnimation] = useState(false)

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

    setSeeds(seeds - 1)
    setPlots(plots.map(p => 
      p.id === plotId 
        ? { ...p, stage: 'sprouting', plantedAt: Date.now() }
        : p
    ))
  }

  const toggleMessage = (messageId) => {
    const message = messages.find(m => m.id === messageId)
    
    if (message.isOpen) {
      setSelectedMessage(message)
      return
    }

    setMessages(messages.map(m => 
      m.id === messageId 
        ? { ...m, isOpen: true }
        : m
    ))

    setSelectedMessage(message)
    setShowSeedAnimation(true)
    setSeeds(seeds + 1)

    setTimeout(() => {
      setShowSeedAnimation(false)
    }, 2000)
  }

  const closeMessage = () => {
    setSelectedMessage(null)
  }

  const getPlotVisual = (stage) => {
    switch(stage) {
      case 'empty':
        return '➕'
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f0' }}>
      {selectedMessage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}
          onClick={closeMessage}
        >
          <div 
            style={{
              backgroundColor: '#fafaf7',
              borderRadius: '24px',
              padding: '3rem',
              maxWidth: '650px',
              width: '90%',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '3px solid #E8C5B5',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMessage.isOpen && (
              <div style={{
                backgroundColor: '#fff9e6',
                border: '1px solid #d4a574',
                borderRadius: '12px',
                padding: '0.3rem',
                marginBottom: '1.5rem',
                color: '#8B7355',
                fontSize: '1.1rem',
                textAlign: 'center',
                fontWeight: 500
              }}>
                You've already read this one!
              </div>
            )}

            <button
              onClick={closeMessage}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: '#E8C5B5',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#8B7355',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#D9B6A6'
                e.target.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#E8C5B5'
                e.target.style.transform = 'scale(1)'
              }}
            >
              ✕
            </button>

            <div style={{
              display: 'inline-block',
              backgroundColor: '#9CAF88',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              fontWeight: 500
            }}>
              from: {selectedMessage.from}
            </div>

            <h2 style={{ 
              marginBottom: '1.5rem', 
              paddingRight: '2rem',
              fontSize: '1.6rem',
              color: '#8B7355',
              fontWeight: 100,
              lineHeight: 1.2,
            }}>
              {selectedMessage.subject}
            </h2>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '16px',
              border: '2px solid #E8E3D8',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)',
            }}>
              <p style={{ 
                lineHeight: '1.8', 
                color: '#5a4a3d',
                fontSize: '1.0rem',
                margin: 0
              }}>
                {selectedMessage.content}
              </p>
            </div>

            {showSeedAnimation && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'seedFloat 2s ease-out',
                fontSize: '3rem',
                pointerEvents: 'none'
              }}>
                <img src="/small-seed.png" alt="seed" style={{ width: '3rem', height: '3rem', objectFit: 'contain' }} />
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap');
          
          @keyframes seedFloat {
            0% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(0.5);
            }
            50% {
              transform: translate(-50%, -100%) scale(1.2);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -150%) scale(1);
            }
          }
        `}
      </style>

      <div style={{ 
        borderBottom: '1px solid #ccc', 
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: 'white'
      }}>
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
            Garden
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
            onClick={() => setActiveCategory('My Mentor')}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: activeCategory === 'My Mentor' ? 'bold' : 'normal',
              fontSize: '1rem'
            }}
          >
            My Pen Pal
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

        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <img 
            src="/toolbar-logo.png" 
            alt="Logo" 
            style={{ 
              height: '60px',
              objectFit: 'contain'
            }} 
          />
        </div>

        <div style={{ 
          fontSize: '1.1rem', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>
            <img src="/small-seed.png" alt="seed" style={{ width: '1.7rem', height: '1.7rem', objectFit: 'contain' }} />
          </span>
          <span>Seeds: {seeds}</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '2rem' }}>
        {activeCategory === 'My Garden' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
              Click on an empty plot (➕) to plant a seed!
            </p>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                width: '100%',
                maxWidth: '680px',
                padding: '1.5rem',
                backgroundColor: '#7cb342',
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
                        backgroundColor: 'rgb(151, 95, 62)',
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
        
        {activeCategory === 'My Mentor' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '100%',
              maxWidth: '900px',
              padding: '2rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '12px',
              border: '2px solid #e0e0e0',
              display: 'flex',
              gap: '2rem',
              alignItems: 'flex-start'
            }}>
              <div style={{ 
                width: '350px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                <div style={{ 
                  width: '100%',
                  aspectRatio: '1',
                  backgroundColor: '#ddd',
                  borderRadius: '12px',
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

                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  margin: 0
                }}>
                  Dr. Sarah Johnson
                </h3>
              </div>

              <div style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                justifyContent: 'center'
              }}>
                <div>
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
          </div>
        )}
        
        {activeCategory === 'Mailbox' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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
                  <div style={{
                    width: '250px',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
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

            <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '1rem' }}>🧪 Demo Controls (for testing)</h3>
              <button 
                onClick={() => {
                  const newId = messages.length
                  setMessages([...messages, {
                    id: newId,
                    isOpen: false,
                    from: 'Test Sender',
                    subject: 'Test message #' + (newId + 1),
                    content: 'This is a test message content. Opening this will give you a seed!'
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ 
              display: 'flex',
              gap: '2rem',
              width: '100%',
              maxWidth: '1200px',
              alignItems: 'stretch'
            }}>
              <div style={{ 
                flex: 1,
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid #e0e0e0'
              }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Account Information</h2>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Name
                  </label>
                  <input 
                    type="text"
                    value="John Doe"
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      backgroundColor: '#e9e9e9',
                      color: '#888',
                      fontSize: '1rem',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Email
                  </label>
                  <input 
                    type="email"
                    value="johndoe@example.com"
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      backgroundColor: '#e9e9e9',
                      color: '#888',
                      fontSize: '1rem',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Grade Level
                  </label>
                  <input 
                    type="text"
                    value="10th Grade"
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      backgroundColor: '#e9e9e9',
                      color: '#888',
                      fontSize: '1rem',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Guardian
                  </label>
                  <input 
                    type="text"
                    value="Jane Doe"
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      backgroundColor: '#e9e9e9',
                      color: '#888',
                      fontSize: '1rem',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Hobbies & Interests
                  </label>
                  <textarea 
                    placeholder="Enter your hobbies and interests..."
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      backgroundColor: 'white',
                      fontSize: '1rem',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div style={{ 
                width: '400px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
              }}>
                <div style={{ 
                  backgroundColor: '#f9f9f9',
                  borderRadius: '12px',
                  padding: '2rem',
                  border: '1px solid #e0e0e0'
                }}>
                  <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Statistics</h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ 
                      backgroundColor: 'white', 
                      padding: '0.75rem', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>Total Letters Sent</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>12</p>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: 'white', 
                      padding: '0.75rem', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>Total Letters Received</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>18</p>
                    </div>

                    <div style={{ 
                      backgroundColor: 'white', 
                      padding: '0.75rem', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>Date Joined</p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#333' }}>January 15, 2026</p>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: '#f9f9f9',
                  borderRadius: '12px',
                  padding: '2rem',
                  border: '1px solid #e0e0e0'
                }}>
                  <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Account Actions</h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#9CAF88',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}>
                      Reset Password
                    </button>

                    <button style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#9CAF88',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}>
                      Reset Email
                    </button>

                    <button style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'transparent',
                      color: '#c66161',
                      border: '2px solid #c66161',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}