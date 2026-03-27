import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--surface2)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "10px 14px", fontSize: 13,
    }}>
      <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginTop: 2 }}>
          {p.name}: ₹{Number(p.value).toLocaleString("en-IN")}
        </div>
      ))}
    </div>
  );
};

export default function IncomeExpenseBarChart({ data }) {
  if (!data?.length) return (
    <div className="empty-state" style={{ height: 260 }}>
      <div className="empty-state-icon">📊</div>
      <div className="empty-state-text">No data to display</div>
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "var(--text3)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false}
          tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+"K" : v}`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={v => <span style={{ color: "var(--text2)", fontSize: 12 }}>{v}</span>} />
        <Bar dataKey="income" fill="var(--green)" radius={[4, 4, 0, 0]} name="Income" />
        <Bar dataKey="expense" fill="var(--red)" radius={[4, 4, 0, 0]} name="Expense" />
      </BarChart>
    </ResponsiveContainer>
  );
}
