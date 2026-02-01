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
    { id: 0, isOpen: false, from: 'Dr. Sarah Johnson', subject: 'Welcome to the mentorship program!', content: 'Welcome to our mentorship program! I\'m excited to be your mentor and help you grow in your learning journey.' },
    { id: 1, isOpen: false, from: 'System', subject: 'You earned 3 seeds!', content: 'Congratulations! You\'ve earned 3 seeds for completing your first week. Plant them in your garden!' },
    { id: 2, isOpen: true, from: 'Dr. Sarah Johnson', subject: 'Great progress this week', content: 'I\'ve noticed your great progress this week. Keep up the excellent work!' },
    { id: 3, isOpen: false, from: 'Community', subject: 'New achievement unlocked', content: 'You\'ve unlocked a new achievement! Your dedication is paying off.' },
    { id: 4, isOpen: false, from: 'Dr. Sarah Johnson', subject: 'Tips for your garden', content: 'Here are some tips to help your garden flourish. Remember to check on your plants regularly!' },
    { id: 5, isOpen: true, from: 'System', subject: 'Weekly summary', content: 'Here\'s your weekly summary of activities and achievements.' },
  ])

  // Modal state for viewing messages
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showSeedAnimation, setShowSeedAnimation] = useState(false)

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
    const message = messages.find(m => m.id === messageId)
    
    if (message.isOpen) {
      // Message already opened - just show it without seed animation
      setSelectedMessage(message)
      return
    }

    // Mark message as opened
    setMessages(messages.map(m => 
      m.id === messageId 
        ? { ...m, isOpen: true }
        : m
    ))

    // Show the message popup
    setSelectedMessage(message)

    // Show seed animation and add seed
    setShowSeedAnimation(true)
    setSeeds(seeds + 1)

    // Hide seed animation after 2 seconds
    setTimeout(() => {
      setShowSeedAnimation(false)
    }, 2000)
  }

  // Close the message popup
  const closeMessage = () => {
    setSelectedMessage(null)
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
      {/* Message Popup Modal */}
      {selectedMessage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={closeMessage}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              position: 'relative',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Already opened banner */}
            {selectedMessage.isOpen && (
              <div style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '6px',
                padding: '0.75rem',
                marginBottom: '1rem',
                color: '#856404',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                ⚠️ This message has already been opened
              </div>
            )}

            {/* Close button */}
            <button
              onClick={closeMessage}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ✕
            </button>

            {/* Message content */}
            <h2 style={{ marginBottom: '1rem', paddingRight: '2rem' }}>{selectedMessage.subject}</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              From: {selectedMessage.from}
            </p>
            <p style={{ lineHeight: '1.6', color: '#333' }}>
              {selectedMessage.content}
            </p>

            {/* Seed animation */}
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
                🌰
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
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

      {/* Toolbar */}
      <div style={{ 
        borderBottom: '1px solid #ccc', 
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
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

        {/* Centered Logo */}
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
              height: '40px',
              objectFit: 'contain'
            }} 
          />
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
                  {/* Envelope Image */}
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
            <h1 style={{ marginBottom: '2rem' }}>My Account</h1>
            
            {/* Top Row - Account Info and Statistics */}
            <div style={{ 
              display: 'flex',
              gap: '2rem',
              width: '100%',
              maxWidth: '1200px',
              alignItems: 'flex-start',
              marginBottom: '2rem'
            }}>
              {/* Left Side - Account Information */}
              <div style={{ 
                flex: 1,
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid #e0e0e0'
              }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Account Information</h2>
                
                {/* Name - Greyed out */}
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

                {/* Email - Greyed out */}
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

                {/* Guardian - Greyed out */}
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

                {/* Hobbies & Interests - Editable */}
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

              {/* Right Side - Statistics */}
              <div style={{ 
                width: '400px',
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid #e0e0e0'
              }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Statistics</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Total Letters Sent</p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>12</p>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Total Letters Received</p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>18</p>
                  </div>

                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Date Joined</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>January 15, 2026</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Account Actions */}
            <div style={{ 
              width: '100%',
              maxWidth: '1200px',
              backgroundColor: '#f9f9f9',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid #e0e0e0'
            }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Account Actions</h2>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4f8f63',
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
                  backgroundColor: '#4f8f63',
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
                  color: '#ff0000',
                  border: '2px solid #ff0000',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  DELETE ACCOUNT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}