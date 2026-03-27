import { useMemo } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { useTransactions } from "../hooks/useTransactions";
import { formatCurrency } from "../utils/currencyFormatter";
import CategoryPieChart from "../components/Charts/PieChart";
import MonthlyLineChart from "../components/Charts/LineChart";
import IncomeExpenseBarChart from "../components/Charts/BarChart";

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

export default function Analytics() {
  const { transactions, income, expense, balance, byCategory } = useTransactions();

  // Pie chart data
  const pieData = useMemo(() =>
    Object.entries(byCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8),
    [byCategory]
  );

  // Monthly data for line + bar charts
  const monthlyData = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      if (!t.date) return;
      try {
        const key = format(parseISO(t.date), "MMM yy");
        if (!map[key]) map[key] = { month: key, income: 0, expense: 0, date: t.date };
        if (t.type === "income") map[key].income += Number(t.amount);
        else map[key].expense += Number(t.amount);
      } catch (_) {}
    });
    return Object.values(map)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-8);
  }, [transactions]);

  const savingsRate = income > 0 ? (((income - expense) / income) * 100).toFixed(1) : "0.0";
  const avgExpense = transactions.filter(t => t.type === "expense").length > 0
    ? (expense / transactions.filter(t => t.type === "expense").length).toFixed(0)
    : 0;

  return (
    <div className="page-wrapper">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={fadeUp} className="page-header">
          <div className="page-title">Analytics</div>
          <div className="page-subtitle">Visual breakdown of your finances</div>
        </motion.div>

        {/* Summary numbers */}
        <motion.div variants={fadeUp}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Total Income", value: formatCurrency(income, true), color: "var(--green)" },
              { label: "Total Expense", value: formatCurrency(expense, true), color: "var(--red)" },
              { label: "Net Savings", value: formatCurrency(balance, true), color: balance >= 0 ? "var(--green)" : "var(--red)" },
              { label: "Savings Rate", value: `${savingsRate}%`, color: "var(--accent)" },
              { label: "Avg Expense", value: formatCurrency(avgExpense, true), color: "var(--yellow)" },
            ].map(({ label, value, color }) => (
              <div key={label} className="card-sm" style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "var(--mono)" }}>{value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Charts row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <motion.div variants={fadeUp} className="card">
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Spending by Category</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>Where your money goes</div>
            <CategoryPieChart data={pieData} />
          </motion.div>

          <motion.div variants={fadeUp} className="card">
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Monthly Trend</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>Income vs expenses over time</div>
            <MonthlyLineChart data={monthlyData} />
          </motion.div>
        </div>

        {/* Bar chart full width */}
        <motion.div variants={fadeUp} className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Income vs Expense — Monthly</div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>Comparative view per month</div>
          <IncomeExpenseBarChart data={monthlyData} />
        </motion.div>

        {/* Category breakdown table */}
        {pieData.length > 0 && (
          <motion.div variants={fadeUp} className="card">
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Category Breakdown</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {pieData.map(({ name, value }) => (
                <div key={name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", background: "var(--surface2)", borderRadius: "var(--radius-sm)",
                }}>
                  <span style={{ fontSize: 14, color: "var(--text2)" }}>{name}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--red)", fontFamily: "var(--mono)" }}>
                    {formatCurrency(value)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {transactions.length === 0 && (
          <motion.div variants={fadeUp} className="empty-state card">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-text">No data to analyze yet</div>
            <div className="empty-state-sub">Add some transactions to see your analytics</div>
          </motion.div>
        )}
      </motion.div>

      {/* Responsive grid fix */}
      <style>{`
        @media (max-width: 640px) {
          .analytics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
