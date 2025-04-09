import React from 'react';

export default function InsightsView({ data }) {
  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "1rem",
        background: "#fff8dc",
        borderRadius: "12px",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>📊 Promo Performance Insights</h3>
      <table
        style={{
          width: "100%",
          fontSize: "0.9rem",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>SKU</th>
            <th>Conversion</th>
            <th>Revenue</th>
            <th>Margin</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ borderTop: "1px solid #ddd" }}>
              <td style={{ padding: "0.5rem" }}>{row.sku}</td>
              <td>{row.conversion}%</td>
              <td>${row.revenue.toLocaleString()}</td>
              <td>${row.margin.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
