// Smart Promo Designer with Back, Restart and Step Tracker
import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const handleUserMessage = (goalText = null) => {
    const message = goalText || userInput.trim();
    if (!message) return;
    const newMessage = { sender: 'user', text: message };
    setChat(prev => [...prev, newMessage]);

    const step = followUps.step;
    const newChat = [{ sender: 'user', text: message }];

    if (step === 0) {
      setFollowUps(prev => ({ ...prev, goal: message, step: 1 }));
      newChat.push({ sender: 'bot', text: 'What is your budget for this promotion?' });
    } else if (step === 1) {
      setFollowUps(prev => ({ ...prev, budget: message, step: 2 }));
      newChat.push({ sender: 'bot', text: 'Is there a margin you want to maintain? (optional)' });
    } else if (step === 2) {
      setFollowUps(prev => ({ ...prev, margin: message, step: 3 }));
      newChat.push({ sender: 'bot', text: 'When would you like to run this promotion?' });
    } else if (step === 3) {
      setFollowUps(prev => ({ ...prev, duration: message, step: 4 }));
      newChat.push({ sender: 'bot', text: 'Thanks! Calculating your best promo suggestion...' });

      const promoTemplates = [
        {
          promoType: 'Coupon - 5% Off',
          predictedROI: '14%',
          expectedSales: 950,
          expectedValue: 28500,
          expectedMargin: 5700,
          why: 'Low-effort incentive that boosts conversion without harming margin too much.',
          risk: 'Easily overused; can reduce perceived product value.',
          promoCopy: 'Save 5% instantly with this coupon – limited time only!'
        },
        {
          promoType: 'Buy 2 Get 5% Off',
          predictedROI: '17%',
          expectedSales: 1100,
          expectedValue: 33000,
          expectedMargin: 6600,
          why: 'Increases average order size and encourages volume purchases.',
          risk: 'Not all customers may want to buy multiple units.',
          promoCopy: 'Buy any 2 items and get 5% off your total – mix & match!'
        },
        {
          promoType: 'Buy $50 Get $20 Credit',
          predictedROI: '20%',
          expectedSales: 1250,
          expectedValue: 37500,
          expectedMargin: 7500,
          why: 'Boosts cart size and brings customers back with credit.',
          risk: 'Credit may not be redeemed or used efficiently.',
          promoCopy: 'Spend $50 and get $20 in store credit – shop more, save more!'
        },
        {
          promoType: 'Deal - 10% Off',
          predictedROI: '18%',
          expectedSales: 1150,
          expectedValue: 34500,
          expectedMargin: 6900,
          why: 'Straightforward discount with high appeal and easy execution.',
          risk: 'Could train buyers to wait for deals.',
          promoCopy: 'Deal Alert: 10% off everything this weekend only!'
        }
      ];
      const chosen = promoTemplates[Math.floor(Math.random() * promoTemplates.length)];
      setSuggestion(chosen);
      newChat.push({ sender: 'bot', type: 'summary', content: chosen });
    }

    setChat(prev => [...prev, ...newChat]);
    setUserInput('');
  };
  const stepLabels = ['Goal', 'Budget', 'Margin', 'Duration', 'Suggestion'];
  const suggestedGoals = [
    { label: 'Increase visibility', icon: '🔍' },
    { label: 'Clear out old inventory', icon: '📦' },
    { label: 'Boost short-term sales', icon: '⚡' },
    { label: 'Drive repeat purchases', icon: '🔁' },
    { label: 'Launch a new product', icon: '🚀' }
  ];
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
