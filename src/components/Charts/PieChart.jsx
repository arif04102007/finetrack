import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6c8fff", "#3ecf8e", "#f87171", "#fbbf24", "#a78bfa", "#fb923c", "#38bdf8", "#f472b6"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--surface2)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "10px 14px", fontSize: 13,
    }}>
      <div style={{ fontWeight: 600, color: "var(--text)" }}>{payload[0].name}</div>
      <div style={{ color: payload[0].payload.fill, marginTop: 4 }}>
        ₹{Number(payload[0].value).toLocaleString("en-IN")}
      </div>
    </div>
  );
};

export default function CategoryPieChart({ data }) {
  if (!data?.length) return (
    <div className="empty-state" style={{ height: 240 }}>
      <div className="empty-state-icon">📊</div>
      <div className="empty-state-text">No expense data yet</div>
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ color: "var(--text2)", fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
