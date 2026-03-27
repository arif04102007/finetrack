import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { RiSaveLine, RiWalletLine, RiAlertLine, RiCheckLine } from "react-icons/ri";
import { useBudget } from "../hooks/useBudget";
import { useTransactions } from "../hooks/useTransactions";
import { formatCurrency } from "../utils/currencyFormatter";
import BudgetCard from "../components/BudgetCard";

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

export default function Budget() {
  const { budget, setBudget, expense, remaining, percentage, isOver, isWarning } = useBudget();
  const { byCategory } = useTransactions();
  const [inputVal, setInputVal] = useState(budget);

  const handleSave = () => {
    if (!inputVal || Number(inputVal) <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }
    setBudget(inputVal);
    toast.success("Budget updated!");
  };

  const categoryList = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({
      name,
      amount,
      pct: budget > 0 ? Math.min((amount / budget) * 100, 100) : 0,
    }));

  return (
    <div className="page-wrapper">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={fadeUp} className="page-header">
          <div className="page-title">Budget</div>
          <div className="page-subtitle">Set and track your monthly spending limit</div>
        </motion.div>

        {/* Set Budget */}
        <motion.div variants={fadeUp} className="card" style={{ marginBottom: 20, maxWidth: 480 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <RiWalletLine color="var(--accent)" size={18} />
            Set Monthly Budget
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "var(--text2)", fontSize: 16, fontWeight: 600,
              }}>₹</span>
              <input
                className="form-input"
                type="number"
                style={{ paddingLeft: 28 }}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Enter budget amount"
              />
            </div>
            <button className="btn btn-primary" onClick={handleSave} style={{ flexShrink: 0 }}>
              <RiSaveLine size={16} /> Save
            </button>
          </div>

          {/* Quick presets */}
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[25000, 50000, 75000, 100000, 150000].map(preset => (
              <button
                key={preset}
                className="btn btn-ghost btn-sm"
                onClick={() => setInputVal(preset)}
                style={{ fontSize: 12 }}
              >
                {formatCurrency(preset, true)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Budget overview card */}
        <motion.div variants={fadeUp}>
          <BudgetCard
            budget={budget}
            expense={expense}
            remaining={remaining}
            percentage={percentage}
            isOver={isOver}
            isWarning={isWarning}
          />
        </motion.div>

        {/* Warning banner */}
        {isOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "var(--red-dim)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: "var(--radius)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              fontSize: 14,
              color: "var(--red)",
            }}
          >
            <RiAlertLine size={20} />
            <div>
              <strong>You've exceeded your budget by {formatCurrency(Math.abs(remaining))}!</strong>
              <div style={{ color: "var(--red)", opacity: 0.8, fontSize: 13, marginTop: 2 }}>
                Consider reducing your expenses or increasing your budget.
              </div>
            </div>
          </motion.div>
        )}

        {isWarning && !isOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: "var(--yellow-dim)",
              border: "1px solid rgba(251,191,36,0.3)",
              borderRadius: "var(--radius)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              fontSize: 14,
              color: "var(--yellow)",
            }}
          >
            <RiAlertLine size={20} />
            You've used {percentage.toFixed(0)}% of your budget. Be mindful of spending!
          </motion.div>
        )}

        {!isOver && !isWarning && budget > 0 && (
          <motion.div
            variants={fadeUp}
            style={{
              background: "var(--green-dim)",
              border: "1px solid rgba(62,207,142,0.2)",
              borderRadius: "var(--radius)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              fontSize: 14,
              color: "var(--green)",
            }}
          >
            <RiCheckLine size={20} />
            You're within budget — {formatCurrency(remaining)} remaining. Keep it up!
          </motion.div>
        )}

        {/* Spending by category */}
        {categoryList.length > 0 && (
          <motion.div variants={fadeUp} className="card">
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 18 }}>Spending by Category</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {categoryList.map(({ name, amount, pct }) => (
                <div key={name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: "var(--text)" }}>{name}</span>
                    <span style={{ color: "var(--text2)", fontFamily: "var(--mono)" }}>
                      {formatCurrency(amount)} <span style={{ color: "var(--text3)" }}>· {pct.toFixed(1)}%</span>
                    </span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      style={{
                        background: pct > 80 ? "var(--red)" : pct > 50 ? "var(--yellow)" : "var(--accent)",
                        width: `${pct}%`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
