const CATEGORIES = ["All", "Salary", "Freelance", "Investment", "Business", "Food", "Housing", "Transport", "Entertainment", "Shopping", "Utilities", "Health", "Education", "Travel", "Other"];

export default function Filters({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <select className="form-input" style={{ width: "auto", minWidth: 120 }} value={filters.type} onChange={e => set("type", e.target.value)}>
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select className="form-input" style={{ width: "auto", minWidth: 140 }} value={filters.category} onChange={e => set("category", e.target.value)}>
        {CATEGORIES.map(c => <option key={c} value={c === "All" ? "all" : c}>{c}</option>)}
      </select>

      <select className="form-input" style={{ width: "auto", minWidth: 130 }} value={filters.sort} onChange={e => set("sort", e.target.value)}>
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
        <option value="amount-desc">Highest Amount</option>
        <option value="amount-asc">Lowest Amount</option>
      </select>
    </div>
  );
}
