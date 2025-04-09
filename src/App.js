// Smart Promo Designer with Back, Restart and Step Tracker
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [suggestion, setSuggestion] = useState(null);
  const [images, setImages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [followUps, setFollowUps] = useState({ step: 0, goal: null, budget: null, margin: null, duration: null });
  const chatEndRef = useRef(null);

  const handleBack = () => {
    setChat(prev => prev.slice(0, -2));
    setFollowUps(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const handleRestart = () => {
    setChat([]);
    setFollowUps({ step: 0, goal: null, budget: null, margin: null, duration: null });
    setUserInput('');
    setSuggestion(null);
    setImages([]);
      }, 1200);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>Smart Promo Designer</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button onClick={handleBack} disabled={followUps.step === 0}>← Back</button>
        <span>Step {followUps.step + 1} of 5: {stepLabels[followUps.step]}</span>
        <button onClick={handleRestart}>⟳ Restart</button>
      </div>

      {followUps.step === 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Popular Goals:</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {suggestedGoals.map((goal, idx) => (
              <button
                key={idx}
                style={{ padding: '0.5rem 1rem', borderRadius: '20px', background: '#eee', border: 'none', cursor: 'pointer' }}
                onClick={() => handleUserMessage(goal.label)}
              >
                {goal.icon} {goal.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', background: '#f9f9f9', minHeight: '300px', maxHeight: '60vh', overflowY: 'auto' }}>
        {chat.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '1rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            {msg.type === 'summary' ? (
              <div style={{ background: '#eef1f4', padding: '1rem', borderRadius: '8px' }}>
                <p><strong>Type:</strong> {msg.content.promoType}</p>
                <p><strong>ROI:</strong> {msg.content.predictedROI}</p>
                <p><strong>Why:</strong> {msg.content.why}</p>
                <p><strong>Risk:</strong> {msg.content.risk}</p>
                <p><strong>Copy:</strong> {msg.content.promoCopy}</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {images.map((url, i) => (
                    <img key={i} src={url} alt={`related-${i}`} style={{ width: '120px', borderRadius: '8px' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  ))}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { name: 'With Promo', value: msg.content.expectedValue, margin: msg.content.expectedMargin },
                      { name: 'No Promo', value: msg.content.expectedValue * 0.75, margin: msg.content.expectedMargin * 0.6 }
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Sales ($)" />
                      <Bar dataKey="margin" fill="#82ca9d" name="Net Margin ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <span style={{ background: msg.sender === 'user' ? '#d1e7dd' : '#e2e3e5', padding: '0.5rem 1rem', borderRadius: '16px', display: 'inline-block' }}>
                {msg.text}
              </span>
            )}
          </div>
        ))}
        {isTyping && <div style={{ fontStyle: 'italic' }}>Bot is typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleUserMessage()}
          placeholder="Type your answer..."
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={() => handleUserMessage()} style={{ padding: '0.5rem 1rem' }}>Send</button>
      </div>
    </div>
  
  );
}

export default App;
