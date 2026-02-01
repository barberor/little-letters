'use client'

import { useState, useEffect } from 'react'

type Profile = {
  id: string
  full_name: string
  grade: string
  interests: string
  role: string
}

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('My Garden')
  
  const [userRole, setUserRole] = useState('mentor')
  const [isMatched, setIsMatched] = useState(false)
  const [isApproved, setIsApproved] = useState(true)
  const [availableStudents, setAvailableStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [matchingInProgress, setMatchingInProgress] = useState(false)
  const [penpalInfo, setPenpalInfo] = useState<Profile | null>(null)
  const [userProfile, setUserProfile] = useState(null)
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [letterContent, setLetterContent] = useState('')
  const [letterSubject, setLetterSubject] = useState('')
  const [sendingLetter, setSendingLetter] = useState(false)
  
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

  // Mailbox state - NOW EMPTY, LOADED FROM DATABASE
  const [mailboxTab, setMailboxTab] = useState('received')
  const [messages, setMessages] = useState([])
  const [sentMessages, setSentMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showSeedAnimation, setShowSeedAnimation] = useState(false)

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/me/profile')
      if (response.ok) {
        const profile = await response.json()
        setUserProfile(profile)
        setUserRole(profile.role)
        setIsMatched(profile.matched)
        setIsApproved(profile.approved)
        setSeeds(parseInt(profile.seed_count) || 3)

        if (profile.matched) {
          const matchResponse = await fetch('/api/match')
          if (matchResponse.ok) {
            const matchData = await matchResponse.json()
            if (matchData) {
              const penpalId = profile.role === 'mentor' ? matchData.student_id : matchData.mentor_id
              
              const penpalResponse = await fetch(`/api/profiles/${penpalId}`)
              if (penpalResponse.ok) {
                const penpal = await penpalResponse.json()
                setPenpalInfo(penpal)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }
  fetchUserData()
}, [])

  // NEW: Fetch letters when viewing Mailbox
  useEffect(() => {
    if (activeCategory === 'Mailbox') {
      fetchLetters()
    }
  }, [activeCategory])

  useEffect(() => {
    if (activeCategory === 'Find a Pen Pal' && userRole === 'mentor' && !isMatched) {
      fetchAvailableStudents()
    }
  }, [activeCategory, userRole, isMatched])

  // NEW: Fetch letters from database
  const fetchLetters = async () => {
    setLoadingMessages(true)
    try {
      const response = await fetch('/api/letters')
      if (response.ok) {
        const letters = await response.json()
        
        // Separate received and sent letters
        const received = letters
          .filter(letter => letter.sender_name !== 'You')
          .map(letter => ({
            id: letter.id,
            isOpen: false, // All letters start as unopened
            from: letter.sender_name,
            subject: letter.subject,
            content: letter.content
          }))
        
        const sent = letters
          .filter(letter => letter.sender_name === 'You')
          .map(letter => ({
            id: letter.id,
            isOpen: true, // Sent letters are always "open"
            to: letter.receiver_name || 'Your Pen Pal',
            subject: letter.subject,
            content: letter.content
          }))
        
        // If no letters, show welcome message
        if (received.length === 0 && sent.length === 0) {
          setMessages([{
            id: 'welcome',
            isOpen: false,
            from: 'System',
            subject: 'Welcome to Little Letters! 🌱',
            content: 'Welcome to Little Letters! Start writing to your pen pal to grow your garden. Each letter you read earns you a seed!'
          }])
        } else {
          setMessages(received)
        }
        
        setSentMessages(sent)
      }
    } catch (error) {
      console.error('Error fetching letters:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const fetchAvailableStudents = async () => {
    setLoadingStudents(true)
    try {
      const response = await fetch('/api/students/available')
      if (response.ok) {
        const data = await response.json()
        setAvailableStudents(data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const handleCreateMatch = async (studentId) => {
    if (matchingInProgress) return
    
    setMatchingInProgress(true)
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId }),
      })

      if (response.ok) {
        setIsMatched(true)
        alert('Successfully matched! You can now start writing letters.')
        setActiveCategory('Mailbox')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create match')
      }
    } catch (error) {
      console.error('Error creating match:', error)
      alert('An error occurred while matching')
    } finally {
      setMatchingInProgress(false)
    }
  }

  const handleLogout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    })
    if (response.ok) {
      window.location.href = '/'
    }
  } catch (error) {
    console.error('Logout error:', error)
  }
}

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
    const currentMessages = mailboxTab === 'received' ? messages : sentMessages
    const message = currentMessages.find(m => m.id === messageId)
    
    if (message.isOpen) {
      setSelectedMessage(message)
      return
    }

    if (mailboxTab === 'received') {
      setMessages(messages.map(m => 
        m.id === messageId 
          ? { ...m, isOpen: true }
          : m
      ))
    } else {
      setSentMessages(sentMessages.map(m => 
        m.id === messageId 
          ? { ...m, isOpen: true }
          : m
      ))
    }

    setSelectedMessage(message)
    
    // Only give seed for received messages
    if (mailboxTab === 'received') {
      setShowSeedAnimation(true)
      setSeeds(seeds + 1)

      setTimeout(() => {
        setShowSeedAnimation(false)
      }, 2000)
    }
  }

  const closeMessage = () => {
    setSelectedMessage(null)
  }

  const handleSendLetter = async () => {
  if (!letterContent.trim()) {
    alert('Please write something before sending!')
    return
  }

  if (!letterSubject.trim()) {
    alert('Please add a subject!')
    return
  }

  if (!penpalInfo?.id) {
    alert('No pen pal found!')
    return
  }

  setSendingLetter(true)
  try {
    const response = await fetch('/api/letters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receiverId: penpalInfo.id,
        subject: letterSubject,
        content: letterContent,
      }),
    })

    if (response.ok) {
      alert('Letter sent successfully!')
      setLetterContent('')
      setLetterSubject('')
      setShowComposeModal(false)
      // Refresh letters from database
      fetchLetters()
    } else {
      const error = await response.json()
      alert(error.error || 'Failed to send letter')
    }
  } catch (error) {
    console.error('Error sending letter:', error)
    alert('An error occurred while sending the letter')
  } finally {
    setSendingLetter(false)
  }
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
    {showComposeModal && (
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
          zIndex: 1001
        }}
        onClick={() => setShowComposeModal(false)}
      >
        <div 
          style={{
            backgroundColor: '#fafaf7',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '3px solid #E8C5B5',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, color: '#8B7355', fontSize: '1.8rem' }}>
              Write to {penpalInfo?.full_name || 'Your Pen Pal'}
            </h2>
            <button
              onClick={() => setShowComposeModal(false)}
              style={{
                background: '#E8C5B5',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#8B7355',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                transition: 'all 0.2s'
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
          </div>

          <input
            type="text"
            value={letterSubject}
            onChange={(e) => setLetterSubject(e.target.value)}
            placeholder="Subject"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '2px solid #E8E3D8',
              fontFamily: 'inherit',
              marginBottom: '1rem'
            }}
          />

          <textarea
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            placeholder="Write your letter here..."
            style={{
              width: '100%',
              minHeight: '300px',
              padding: '1rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '2px solid #E8E3D8',
              fontFamily: 'inherit',
              resize: 'vertical',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}
          />

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowComposeModal(false)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ccc',
                color: '#666',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSendLetter}
              disabled={sendingLetter}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: sendingLetter ? '#ccc' : '#9CAF88',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: sendingLetter ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!sendingLetter) e.target.style.backgroundColor = '#8a9e78'
              }}
              onMouseLeave={(e) => {
                if (!sendingLetter) e.target.style.backgroundColor = '#9CAF88'
              }}
            >
              {sendingLetter ? 'Sending...' : 'Send Letter'}
            </button>
          </div>
        </div>
      </div>
    )}


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
                This message has already been opened
              </div>
            )}

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
              {mailboxTab === 'received' ? `from: ${selectedMessage.from}` : `to: ${selectedMessage.to}`}
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
                <img src="/small-seed.png" alt="seed" style={{ width: '1.7rem', height: '1.7rem', objectFit: 'contain' }} />
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
          {(userRole === 'student' || (userRole === 'mentor' && isMatched)) && (
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
          )}
          {userRole === 'mentor' && !isMatched && (
            <button 
              onClick={() => setActiveCategory('Find a Pen Pal')}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontWeight: activeCategory === 'Find a Pen Pal' ? 'bold' : 'normal',
                fontSize: '1rem'
              }}
            >
              Find a Pen Pal
            </button>
          )}
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
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>
              <img src="/small-seed.png" alt="seed" style={{ width: '1.7rem', height: '1.7rem', objectFit: 'contain' }} />
            </span>
            <span>Seeds: {seeds}</span>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#9CAF88',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#8a9e78'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#9CAF88'}
          >
            Logout
          </button>
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
            {userRole === 'student' && !isApproved ? (
              <div style={{ 
                width: '100%',
                maxWidth: '600px',
                padding: '3rem',
                backgroundColor: '#fff9e6',
                borderRadius: '12px',
                border: '2px solid #ffd700',
                textAlign: 'center'
              }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                  Waiting on Parent Permission
                </h2>
                <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6' }}>
                  Your parent or guardian needs to approve your account before you can be matched with a pen pal mentor. 
                  Please ask them to check their email!
                </p>
              </div>
            ) : userRole === 'student' && !isMatched ? (
              <div style={{ 
                width: '100%',
                maxWidth: '600px',
                padding: '3rem',
                backgroundColor: '#e8f5e9',
                borderRadius: '12px',
                border: '2px solid #4caf50',
                textAlign: 'center'
              }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                  Waiting for a Pen Pal!
                </h2>
                <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6' }}>
                  You've been approved! A mentor will choose you soon and you'll be able to start writing letters.
                </p>
              </div>
            ) : (
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
                      src="/mentor_demo.jpg" 
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
                    {penpalInfo?.full_name || 'Your Pen Pal'}
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
                     {penpalInfo?.full_name || 'Your pen pal'} loves the ocean! She is majoring in environmental science and wants to protect the sea turtles at all costs. She loves to dive underwater and take marine life!
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
            )}
          </div>
        )}
        
        {activeCategory === 'Mailbox' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {loadingMessages ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                Loading letters...
              </div>
            ) : (
              <>
                <div style={{ 
                  display: 'flex', 
                  gap: '2rem', 
                  marginBottom: '2rem',
                  borderBottom: '2px solid #e0e0e0',
                  paddingBottom: '1rem'
                }}>
                  <button
                    onClick={() => setMailboxTab('received')}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      fontWeight: mailboxTab === 'received' ? 'bold' : 'normal',
                      color: mailboxTab === 'received' ? '#333' : '#999',
                      borderBottom: mailboxTab === 'received' ? '3px solid #9CAF88' : 'none',
                      paddingBottom: '0.5rem'
                    }}
                  >
                    Received
                  </button>
                  <button
                    onClick={() => setMailboxTab('sent')}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      fontWeight: mailboxTab === 'sent' ? 'bold' : 'normal',
                      color: mailboxTab === 'sent' ? '#333' : '#999',
                      borderBottom: mailboxTab === 'sent' ? '3px solid #9CAF88' : 'none',
                      paddingBottom: '0.5rem'
                    }}
                  >
                    Sent
                  </button>
                </div>

                {isMatched && penpalInfo && (
                  <div style={{ marginBottom: '2rem', width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setShowComposeModal(true)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#9CAF88',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#8a9e78'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#9CAF88'}
                    >
                      Send a Letter
                    </button>
                  </div>
                )}

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '2rem',
                  width: '100%',
                  maxWidth: '1200px',
                  padding: '1rem'
                }}>
                  {(mailboxTab === 'received' ? messages : sentMessages).map(message => (
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
                          {mailboxTab === 'received' ? `From: ${message.from}` : `To: ${message.to}`}
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
              </>
            )}
          </div>
        )}

        {activeCategory === 'Find a Pen Pal' && userRole === 'mentor' && !isMatched && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Find a Pen Pal</h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
              Choose a student to become their pen pal mentor!
            </p>
            
            {loadingStudents ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                Loading available students...
              </div>
            ) : availableStudents.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem',
                backgroundColor: 'white',
                borderRadius: '12px',
                color: '#666'
              }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No students available at the moment</p>
                <p style={{ fontSize: '0.9rem' }}>Check back soon!</p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
                width: '100%',
                maxWidth: '1200px'
              }}>
                {availableStudents.map(student => (
                  <div
                    key={student.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <h3 style={{ 
                      margin: '0 0 1rem 0', 
                      fontSize: '1.3rem', 
                      color: '#333',
                      borderBottom: '2px solid #9CAF88',
                      paddingBottom: '0.5rem'
                    }}>
                      {student.full_name || 'Student'}
                    </h3>
                    
                    <div style={{ flex: 1, marginBottom: '1rem' }}>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ color: '#666' }}>Grade:</strong>{' '}
                        <span style={{ color: '#333' }}>{student.grade || 'Not specified'}</span>
                      </div>
                      
                      {student.interests && (
                        <div>
                          <strong style={{ color: '#666' }}>Interests:</strong>
                          <p style={{ 
                            margin: '0.25rem 0 0 0', 
                            color: '#333',
                            lineHeight: '1.5'
                          }}>
                            {student.interests}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleCreateMatch(student.id)}
                      disabled={matchingInProgress}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: matchingInProgress ? '#ccc' : '#9CAF88',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        cursor: matchingInProgress ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        if (!matchingInProgress) {
                          e.target.style.backgroundColor = '#8a9e78'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!matchingInProgress) {
                          e.target.style.backgroundColor = '#9CAF88'
                        }
                      }}
                    >
                      {matchingInProgress ? 'Matching...' : 'Be Their Penpal!'}
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            value={userProfile?.full_name || ''}
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
            value={userProfile?.email || ''}
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
            value={userProfile?.grade || 'Not specified'}
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
            value={userProfile?.interests || ''}
            placeholder="Enter your hobbies and interests..."
            rows="4"
            readOnly
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