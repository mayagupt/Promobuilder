// /insights route – SKU performance mockup
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { sku: "SKU123", conversion: 4.5, revenue: 12000, margin: 3200 },
  { sku: "SKU124", conversion: 6.2, revenue: 15000, margin: 4800 },
  { sku: "SKU125", conversion: 5.1, revenue: 13800, margin: 4100 },
  { sku: "SKU126", conversion: 3.9, revenue: 11200, margin: 2900 },
];

export default function InsightsPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <h1>📊 Promo Insights by SKU</h1>
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        Here’s how your past promotions have performed across your top SKUs:
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={mockData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="sku" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="conversion" fill="#82ca9d" name="Conversion Rate (%)" />
          <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
          <Bar dataKey="margin" fill="#ffc658" name="Margin ($)" />
        </BarChart>
      </ResponsiveContainer>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h3>🧠 Smart Recommendations</h3>
        <ul style={{ paddingLeft: "1.2rem", lineHeight: "1.6" }}>
          <li>
            <strong>SKU124</strong> performs best with high-margin promos —
            consider reusing similar incentives.
            <button
              style={{
                marginLeft: "1rem",
                padding: "0.3rem 0.6rem",
                borderRadius: "6px",
                background: "#0070f3",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => (window.location.href = "/?sku=SKU124")}
            >
              Apply
            </button>
          </li>
          <li>
            <strong>SKU125</strong> has strong conversion with moderate revenue
            — test volume-based offers here.
            <button
              style={{
                marginLeft: "1rem",
                padding: "0.3rem 0.6rem",
                borderRadius: "6px",
                background: "#0070f3",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => (window.location.href = "/?sku=SKU125")}
            >
              Apply
            </button>
          </li>
          <li>
            <strong>SKU126</strong> shows low conversion — try a flash deal to
            increase urgency.
            <button
              style={{
                marginLeft: "1rem",
                padding: "0.3rem 0.6rem",
                borderRadius: "6px",
                background: "#0070f3",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => (window.location.href = "/?sku=SKU126")}
            >
              Apply
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
