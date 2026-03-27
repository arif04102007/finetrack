import { motion } from "framer-motion";
import { RiAlertLine } from "react-icons/ri";
import { formatCurrency } from "../utils/currencyFormatter";

export default function BudgetCard({ budget, expense, remaining, percentage, isOver, isWarning }) {
  const barColor = isOver ? "var(--red)" : isWarning ? "var(--yellow)" : "var(--green)";

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>Monthly Budget</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", fontFamily: "var(--mono)" }}>
            {formatCurrency(budget)}
          </div>
        </div>
        {(isOver || isWarning) && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: isOver ? "var(--red-dim)" : "var(--yellow-dim)",
            color: isOver ? "var(--red)" : "var(--yellow)",
            padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 500,
          }}>
            <RiAlertLine size={15} />
            {isOver ? "Over Budget!" : "Warning"}
          </div>
        )}
      </div>

      <div className="progress-bar" style={{ marginBottom: 12 }}>
        <motion.div
          className="progress-fill"
          style={{ background: barColor, width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
        <div>
          <span style={{ color: "var(--text3)" }}>Spent: </span>
          <span style={{ color: "var(--red)", fontWeight: 600, fontFamily: "var(--mono)" }}>{formatCurrency(expense)}</span>
        </div>
        <div style={{ color: "var(--text3)" }}>{percentage.toFixed(1)}% used</div>
        <div>
          <span style={{ color: "var(--text3)" }}>Left: </span>
          <span style={{ color: isOver ? "var(--red)" : "var(--green)", fontWeight: 600, fontFamily: "var(--mono)" }}>
            {isOver ? `−${formatCurrency(Math.abs(remaining))}` : formatCurrency(remaining)}
          </span>
        </div>
      </div>
    </div>
  );
}
