import React, { useState, useEffect, useRef } from 'react';
import AnalyticsView from "./AnalyticsView";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DashboardNav({ step, onBack, onRestart }) {
  const stepLabels = ['Goal', 'Budget', 'Margin', 'Duration', 'Suggestion'];
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <button onClick={onBack} disabled={step === 0}>← Back</button>
      <span>Step {step + 1} of 5: {stepLabels[step]}</span>
      <button onClick={onRestart}>⟳ Restart</button>
    </div>
  );
}

function GoalSelector({ onSelect }) {
  const goals = [
    { label: 'Increase visibility', icon: '🔍' },
    { label: 'Clear out old inventory', icon: '📦' },
    { label: 'Boost short-term sales', icon: '⚡' },
    { label: 'Drive repeat purchases', icon: '🔁' },
    { label: 'Launch a new product', icon: '🚀' },
    { label: 'Maximize profitability', icon: '💰' }
  ];
  return (
    <div style={{ marginBottom: '1rem' }}>
      <strong>Popular Goals:</strong>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
        {goals.map((goal, idx) => (
          <button
            key={idx}
            style={{ padding: '0.5rem 1rem', borderRadius: '20px', background: '#eee', border: 'none', cursor: 'pointer' }}
            onClick={() => onSelect(goal.label)}
          >
            {goal.icon} {goal.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FollowUpPrompts({ onSelect }) {
  const prompts = [
    'Compare with other promotions',
    'Show me units sold',
    'Clear inventory for SKU 5'
  ];
  return (
    <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {prompts.map((text, i) => (
        <button
          key={i}
          style={{ padding: '0.4rem 0.8rem', borderRadius: '16px', background: '#d9edf7', border: '1px solid #bce8f1', cursor: 'pointer' }}
          onClick={() => onSelect(text)}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [suggestion, setSuggestion] = useState(null);
  const [showAllSKUs, setShowAllSKUs] = useState(true);
  const [followUps, setFollowUps] = useState({ step: 0, goal: null, budget: null, margin: null, duration: null });
  const chatEndRef = useRef(null);

  const promoTemplates = [
    {
      promoType: 'Buy $50 Get $20 Credit', predictedROI: '20%', expectedSales: 1250, expectedValue: 37500, expectedMargin: 7500,
      why: 'Boosts cart size and brings customers back with credit.',
      risk: 'Credit may not be redeemed or used efficiently.',
      promoCopy: 'Spend $50 and get $20 in store credit – shop more, save more!'
    },
    {
      promoType: 'Coupon - 5% Off', predictedROI: '15%', expectedSales: 1000, expectedValue: 30000, expectedMargin: 6000,
      why: 'Simple and widely appealing discount.',
      risk: 'Potential margin erosion if not monitored.',
      promoCopy: '5% off your order today only!'
    }
  ];

  const handleUserMessage = (goalText = null) => {
    const message = goalText || userInput.trim();
    if (!message) return;
    const step = followUps.step;
    const newChat = [{ sender: 'user', text: message }];

    // Handle follow-up prompts first
    if (message === 'Compare with other promotions') {
      const otherPromo = promoTemplates[1];
      setChat(prev => [...prev, ...newChat, { sender: 'bot', text: `📊 Here's another promo option: <strong>${otherPromo.promoType}</strong> with ROI of ${otherPromo.predictedROI}.` }]);
      setUserInput('');
      return;
    }

    if (message === 'Show me units sold') {
      setChat(prev => [...prev, ...newChat, { sender: 'bot', text: `📦 Units sold with promo: <strong>${suggestion?.expectedSales || 1250}</strong>. Without promo: <strong>${Math.floor((suggestion?.expectedSales || 1250) * 0.75)}</strong>.` }]);
      setUserInput('');
      return;
    }

    if (message === 'Clear inventory for SKU 5') {
      setChat(prev => [...prev, ...newChat, { sender: 'bot', text: `🚨 SKU 5 hasn’t sold in 90+ days. A "Buy 1 Get 1 Free" promo could help clear stock and yield ~7% ROI.` }]);
      setUserInput('');
      return;
    }

    if (step === 0) {
      setFollowUps(prev => ({ ...prev, goal: message, step: 1 }));
      newChat.push({ sender: 'bot', text: '💬 Got it! What is your budget for this promotion?' });
    } else if (step === 1) {
      setFollowUps(prev => ({ ...prev, budget: message, step: 2 }));
      newChat.push({ sender: 'bot', text: '📊 Is there a margin you want to maintain? (optional)' });
    } else if (step === 2) {
      setFollowUps(prev => ({ ...prev, margin: message, step: 3 }));
      newChat.push({ sender: 'bot', text: '🗓️ When would you like to run this promotion?' });
    } else if (step === 3) {
      setFollowUps(prev => ({ ...prev, duration: message, step: 4 }));
      newChat.push({ sender: 'bot', text: 'Thanks! Calculating your best promo suggestion...' });

      const chosen = promoTemplates[0];
      setSuggestion(chosen);
      newChat.push({ sender: 'bot', text: `📢 <strong>Recommended Promo:</strong> ${chosen.promoType} (ROI: ${chosen.predictedROI})` });
      newChat.push({ sender: 'bot', text: `📈 This promotion can help generate incremental value of <strong>14%</strong> and long-term buyer retention.` });
      newChat.push({ sender: 'bot', type: 'insights' });
    }

    setChat(prev => [...prev, ...newChat]);
    setUserInput('');
  };

  const handleRestart = () => {
    setChat([]);
    setFollowUps({ step: 0, goal: null, budget: null, margin: null, duration: null });
    setUserInput('');
    setSuggestion(null);
  };

  const handleBack = () => {
    setChat(prev => prev.slice(0, -2));
    setFollowUps(prev => ({ ...prev, step: Math.max(prev.step - 1, 0) }));
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const insightsData = [
    { sku: 'SKU123', conversion: 4.5, revenue: 12000, margin: 3200, withPromo: 16000, withMargin: 4500 },
    { sku: 'SKU124', conversion: 6.2, revenue: 15000, margin: 4800, withPromo: 19500, withMargin: 6200 },
    { sku: 'SKU125', conversion: 5.1, revenue: 13800, margin: 4100, withPromo: 17200, withMargin: 5500 },
    { sku: 'SKU126', conversion: 3.9, revenue: 11200, margin: 2900, withPromo: 14500, withMargin: 3900 }
  ];

  const combinedData = [{
    name: 'All SKUs',
    revenue: insightsData.reduce((sum, d) => sum + d.revenue, 0),
    withPromo: insightsData.reduce((sum, d) => sum + d.withPromo, 0),
    margin: insightsData.reduce((sum, d) => sum + d.margin, 0),
    withMargin: insightsData.reduce((sum, d) => sum + d.withMargin, 0)
  }];

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h1>🧠 Smart Promo Dashboard</h1>
      <DashboardNav step={followUps.step} onBack={handleBack} onRestart={handleRestart} />
      {followUps.step === 0 && <GoalSelector onSelect={handleUserMessage} />}

      <div style={{ marginBottom: '1rem' }}>
        {chat.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', marginBottom: '0.5rem' }}>
            {msg.type === 'insights' ? (
              <div>
                <AnalyticsView data={showAllSKUs ? insightsData : insightsData.filter(sku => sku.sku === 'SKU123')} />
                <div style={{ marginTop: '1rem' }}>
                  <label>
                    <input type="checkbox" checked={showAllSKUs} onChange={() => setShowAllSKUs(prev => !prev)} /> Show all SKUs
                  </label>
                </div>
                <div style={{ marginTop: '2rem' }}>
                  <h3>📊 Combined Revenue and Margin (All SKUs)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={combinedData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue (No Promo)" />
                      <Bar dataKey="withPromo" fill="#82ca9d" name="Revenue (With Promo)" />
                      <Bar dataKey="margin" fill="#ffc658" name="Margin (No Promo)" />
                      <Bar dataKey="withMargin" fill="#a4de6c" name="Margin (With Promo)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <FollowUpPrompts onSelect={handleUserMessage} />
              </div>
            ) : (
              <span style={{ background: msg.sender === 'user' ? '#d1e7dd' : '#f1f1f1', padding: '0.5rem 1rem', borderRadius: '12px', display: 'inline-block' }}>
                <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              </span>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUserMessage()}
          placeholder="Type your answer..."
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={() => handleUserMessage()} style={{ padding: '0.5rem 1rem' }}>Send</button>
      </div>
    </div>
  );
}
