'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('My Garden')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div style={{ 
        borderBottom: '1px solid #ccc', 
        padding: '1rem',
        display: 'flex',
        gap: '2rem'
      }}>
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

      {/* Content Area */}
      <div style={{ flex: 1, padding: '2rem' }}>
        {activeCategory === 'My Garden' && (
          <div>
            <h1>My Garden</h1>
            <p>Your garden content goes here</p>
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