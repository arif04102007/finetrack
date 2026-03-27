import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RiArrowUpLine, RiArrowDownLine, RiScales3Line, RiFireLine, RiAddLine, RiArrowRightLine } from "react-icons/ri";
import { useTransactions } from "../hooks/useTransactions";
import { useBudget } from "../hooks/useBudget";
import { formatCurrency } from "../utils/currencyFormatter";
import TransactionCard from "../components/TransactionCard";
import BudgetCard from "../components/BudgetCard";

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

function StatCard({ label, value, icon: Icon, color, sub, index }) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="card"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500 }}>{label}</div>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: color + "22", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", fontFamily: "var(--mono)", letterSpacing: "-0.5px" }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: "var(--text3)" }}>{sub}</div>}
    </motion.div>
  );
}

export default function Dashboard() {
  const { transactions, income, expense, balance, topCategory, deleteTransaction } = useTransactions();
  const { budget, expense: bExp, remaining, percentage, isOver, isWarning } = useBudget();

  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="page-wrapper">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="page-title">Dashboard</div>
            <div className="page-subtitle">Your financial overview at a glance</div>
          </div>
          <Link to="/transactions/new" className="btn btn-primary">
            <RiAddLine size={16} /> Add Transaction
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard index={0} label="Total Income" value={formatCurrency(income, true)} icon={RiArrowUpLine} color="var(--green)" sub={`${transactions.filter(t => t.type === "income").length} transactions`} />
          <StatCard index={1} label="Total Expenses" value={formatCurrency(expense, true)} icon={RiArrowDownLine} color="var(--red)" sub={`${transactions.filter(t => t.type === "expense").length} transactions`} />
          <StatCard index={2} label="Net Balance" value={formatCurrency(balance, true)} icon={RiScales3Line} color={balance >= 0 ? "var(--green)" : "var(--red)"} sub={balance >= 0 ? "You're doing great!" : "Spending > income"} />
          <StatCard index={3} label="Top Category" value={topCategory || "—"} icon={RiFireLine} color="var(--yellow)" sub="Highest expense category" />
        </div>

        {/* Budget overview */}
        <motion.div variants={fadeUp}>
          <BudgetCard budget={budget} expense={bExp} remaining={remaining} percentage={percentage} isOver={isOver} isWarning={isWarning} />
        </motion.div>

        {/* Recent transactions */}
        <motion.div variants={fadeUp}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Recent Transactions</div>
            <Link to="/transactions" style={{ fontSize: 13, color: "var(--accent)", display: "flex", alignItems: "center", gap: 4 }}>
              View all <RiArrowRightLine size={14} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-state-icon">💸</div>
              <div className="empty-state-text">No transactions yet</div>
              <div className="empty-state-sub">Add your first transaction to get started</div>
              <Link to="/transactions/new" className="btn btn-primary" style={{ marginTop: 12 }}>
                <RiAddLine size={15} /> Add Transaction
              </Link>
            </div>
          ) : (
            recent.map((t, i) => (
              <TransactionCard key={t.id} transaction={t} onDelete={deleteTransaction} index={i} />
            ))
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
