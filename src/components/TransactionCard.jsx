import { motion } from "framer-motion";
import { RiDeleteBin6Line, RiRepeatLine, RiArrowUpLine, RiArrowDownLine } from "react-icons/ri";
import { formatCurrency, formatDate } from "../utils/currencyFormatter";

const categoryEmoji = {
  Salary: "💼", Freelance: "💻", Investment: "📈", Business: "🏢",
  Food: "🍜", Housing: "🏠", Transport: "🚗", Entertainment: "🎬",
  Shopping: "🛍️", Utilities: "💡", Health: "🏥", Education: "📚",
  Travel: "✈️", Other: "📦",
};

export default function TransactionCard({ transaction, onDelete, index = 0 }) {
  const { id, title, amount, type, category, date, recurring, notes } = transaction;
  const isIncome = type === "income";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 18px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        marginBottom: 8,
        transition: "border-color 0.15s, background 0.15s",
        cursor: "default",
      }}
      whileHover={{ borderColor: "var(--border2)" }}
    >
      {/* Category icon */}
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: isIncome ? "var(--green-dim)" : "var(--red-dim)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20,
      }}>
        {categoryEmoji[category] || "💰"}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{title}</span>
          {recurring && (
            <span className="badge badge-recurring" style={{ fontSize: 11 }}>
              <RiRepeatLine size={10} /> Recurring
            </span>
          )}
          <span className={`badge ${isIncome ? "badge-income" : "badge-expense"}`} style={{ fontSize: 11 }}>
            {isIncome ? <RiArrowUpLine size={10} /> : <RiArrowDownLine size={10} />}
            {type}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 3, display: "flex", gap: 12 }}>
          <span>{category}</span>
          <span>·</span>
          <span>{formatDate(date)}</span>
          {notes && <><span>·</span><span style={{ color: "var(--text3)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{notes}</span></>}
        </div>
      </div>

      {/* Amount */}
      <div style={{
        fontWeight: 700, fontSize: 15, flexShrink: 0,
        color: isIncome ? "var(--green)" : "var(--red)",
        fontFamily: "var(--mono)",
      }}>
        {isIncome ? "+" : "−"}{formatCurrency(amount)}
      </div>

      {/* Delete */}
      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="btn-icon btn"
          title="Delete"
          style={{ flexShrink: 0 }}
        >
          <RiDeleteBin6Line size={16} />
        </button>
      )}
    </motion.div>
  );
}
