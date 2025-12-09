// src/components/Graph.jsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export const SingleGraph = ({ data, title }) => {
  // convert to recharts-friendly (x must be string/number)
  const formatted = data.map((d) => ({ x: d.x, y: d.y }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{title}</h4>
      </div>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#2563eb" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const OverlayGraph = ({ dataA = [], dataB = [], title = "Overlay Comparison" }) => {
  // unify x domain by creating a map keyed by x
  const map = new Map();
  dataA.forEach((d) => map.set(String(d.x), { x: d.x, a: d.y }));
  dataB.forEach((d) => {
    const k = String(d.x);
    const existing = map.get(k) || { x: d.x };
    existing.b = d.y;
    map.set(k, existing);
  });

  const merged = Array.from(map.values()).sort((p, q) => {
    // try numeric compare when possible
    const a = Number(p.x);
    const b = Number(q.x);
    if (!Number.isNaN(a) && !Number.isNaN(b)) return a - b;
    if (p.x < q.x) return -1;
    if (p.x > q.x) return 1;
    return 0;
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{title}</h4>
        <div className="text-sm text-gray-500">A = blue • B = green</div>
      </div>
      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <LineChart data={merged}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="a" stroke="#2563eb" dot={false} strokeWidth={2} name="A" />
            <Line type="monotone" dataKey="b" stroke="#10b981" dot={false} strokeWidth={2} name="B" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
