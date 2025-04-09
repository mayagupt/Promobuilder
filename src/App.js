import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [images, setImages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [followUps, setFollowUps] = useState({
    step: 0,
    goal: null,
    budget: null,
    margin: null,
    duration: null,
  });
  const chatEndRef = useRef(null);

  const suggestedGoals = [
    { label: "Increase visibility", category: "Visibility", icon: "🔍" },
    { label: "Clear out old inventory", category: "Inventory", icon: "📦" },
    { label: "Boost short-term sales", category: "Sales", icon: "⚡" },
    { label: "Drive repeat purchases", category: "Retention", icon: "🔁" },
    { label: "Launch a new product", category: "Launch", icon: "🚀" },
  ];

  const promoTemplates = [
    {
      promoType: "Coupon - 5% Off",
      predictedROI: "14%",
      expectedSales: 950,
      expectedValue: 28500,
      expectedMargin: 5700,
      suitability: ["low budget", "short term", "low margin"],
      why: "Low-effort incentive that boosts conversion without harming margin too much.",
      risk: "Easily overused; can reduce perceived product value.",
      promoCopy: "Save 5% instantly with this coupon – limited time only!",
    },
    {
      promoType: "Buy 2 Get 5% Off",
      predictedROI: "17%",
      expectedSales: 1100,
      expectedValue: 33000,
      expectedMargin: 6600,
      suitability: ["mid budget", "volume goal"],
      why: "Increases average order size and encourages volume purchases.",
      risk: "Not all customers may want to buy multiple units.",
      promoCopy: "Buy any 2 items and get 5% off your total – mix & match!",
    },
    {
      promoType: "Buy $50 Get $20 Credit",
      predictedROI: "20%",
      expectedSales: 1250,
      expectedValue: 37500,
      expectedMargin: 7500,
      suitability: ["high budget", "retention", "reengagement"],
      why: "Boosts cart size and brings customers back with credit.",
      risk: "Credit may not be redeemed or used efficiently.",
      promoCopy:
        "Spend $50 and get $20 in store credit – shop more, save more!",
    },
    {
      promoType: "Deal - 10% Off",
      predictedROI: "18%",
      expectedSales: 1150,
      expectedValue: 34500,
      expectedMargin: 6900,
      suitability: ["broad reach", "simple message"],
      why: "Straightforward discount with high appeal and easy execution.",
      risk: "Could train buyers to wait for deals.",
      promoCopy: "Deal Alert: 10% off everything this weekend only!",
    },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleUserMessage = (goalText = null) => {
    const message = goalText || userInput.trim();
    if (!message) return;

    setChat((prev) => [...prev, { sender: "user", text: message }]);
    setUserInput("");

    const step = followUps.step;
    if (step === 0) {
      setFollowUps((prev) => ({ ...prev, goal: message, step: 1 }));
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "What is your budget for this promotion?" },
      ]);
    } else if (step === 1) {
      setFollowUps((prev) => ({
        ...prev,
        budget: message.toLowerCase(),
        step: 2,
      }));
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Is there a specific margin you want to maintain? (optional)",
        },
      ]);
    } else if (step === 2) {
      setFollowUps((prev) => ({ ...prev, margin: message, step: 3 }));
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "When do you want to run this promotion?" },
      ]);
    } else if (step === 3) {
      setFollowUps((prev) => ({ ...prev, duration: message, step: 4 }));

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);

        const chosen =
          promoTemplates.find((t) =>
            t.suitability.includes(followUps.budget)
          ) || promoTemplates[0];
        setSuggestion(chosen);
        const keywordImages =
          followUps.goal.match(/\b\w+\b/g)?.slice(0, 3) || [];
        const fetchedImages = keywordImages.map(
          (keyword, index) =>
            `https://source.unsplash.com/400x300/?${encodeURIComponent(
              keyword
            )}&sig=${index}`
        );
        setImages(fetchedImages);

        setChat((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Here is your personalized promotion suggestion:",
          },
          { sender: "bot", type: "summary", content: chosen },
        ]);
      }, 1200);
    }
  };

  const chartData = suggestion
    ? [
        { name: "Baseline ROI", roi: 10 },
        {
          name: "Predicted ROI",
          roi: parseInt(suggestion.predictedROI.replace("%", "")),
        },
      ]
    : [];

  const valueChartData = suggestion
    ? [
        {
          name: "No Promo",
          sales: suggestion.expectedSales * 0.7,
          value: suggestion.expectedValue * 0.7,
          margin: suggestion.expectedMargin * 0.7,
        },
        {
          name: "With Promo",
          sales: suggestion.expectedSales,
          value: suggestion.expectedValue,
          margin: suggestion.expectedMargin,
        },
      ]
    : [];

  const renderBotBlock = (content) => (
    <div
      style={{
        background: "#f1f3f5",
        padding: "1rem",
        borderRadius: "8px",
        marginTop: "1rem",
      }}
    >
      <p>
        <strong>Type:</strong> {content.promoType}
      </p>
      <p>
        <strong>Predicted ROI:</strong> {content.predictedROI}
      </p>
      <p>
        <strong>Reason:</strong> {content.why}
      </p>
      <p>
        <strong>Risks:</strong> {content.risk}
      </p>
      <p>
        <strong>Suggested Copy:</strong> {content.promoCopy}
      </p>

      <div style={{ marginTop: "1rem" }}>
        <strong>ROI Visualization</strong>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="roi" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <strong>Sales & Margin Comparison</strong>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={valueChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82ca9d" name="Sales Units" />
            <Bar dataKey="value" fill="#8884d8" name="$ Value" />
            <Bar dataKey="margin" fill="#ffc658" name="Net Margin" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <strong>Product Images</strong>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt="Product"
              style={{ width: "150px", height: "auto", borderRadius: "8px" }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => window.print()}>Download Plan</button>
        <button onClick={() => window.location.reload()}>Try Another</button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        Smart Promotion Creator
      </h1>

      <div style={{ margin: "1rem 0" }}>
        <strong style={{ display: "block", marginBottom: "0.5rem" }}>
          Popular Goals:
        </strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {suggestedGoals.map((goal, index) => (
            <button
              key={index}
              style={{
                padding: "0.5rem 1rem",
                background: "#e9ecef",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onClick={() => handleUserMessage(goal.label)}
            >
              <span>{goal.icon}</span> {goal.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          minHeight: "300px",
          background: "#f9f9f9",
          overflowY: "auto",
          maxHeight: "60vh",
        }}
      >
        {chat.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "1rem",
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            {msg.type === "summary" ? (
              renderBotBlock(msg.content)
            ) : (
              <span
                style={{
                  background: msg.sender === "user" ? "#d1e7dd" : "#e2e3e5",
                  padding: "0.5rem 1rem",
                  borderRadius: "16px",
                  display: "inline-block",
                }}
              >
                {msg.text}
              </span>
            )}
          </div>
        ))}
        {isTyping && (
          <div style={{ fontStyle: "italic" }}>Bot is typing...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUserMessage()}
          placeholder="Describe your goal or answer the question..."
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button
          onClick={() => handleUserMessage()}
          style={{ padding: "0.5rem 1rem" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;

