import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { RiAddLine } from "react-icons/ri";
import { useTransactions } from "../hooks/useTransactions";
import { useDebounce } from "../hooks/useDebounce";
import TransactionCard from "../components/TransactionCard";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";

export default function Transactions() {
  const { transactions, deleteTransaction } = useTransactions();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ type: "all", category: "all", sort: "date-desc" });
  const debouncedSearch = useDebounce(search, 280);

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.notes || "").toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    if (filters.type !== "all") list = list.filter(t => t.type === filters.type);
    if (filters.category !== "all") list = list.filter(t => t.category === filters.category);

    list.sort((a, b) => {
      if (filters.sort === "date-desc") return new Date(b.date) - new Date(a.date);
      if (filters.sort === "date-asc") return new Date(a.date) - new Date(b.date);
      if (filters.sort === "amount-desc") return Number(b.amount) - Number(a.amount);
      if (filters.sort === "amount-asc") return Number(a.amount) - Number(b.amount);
      return 0;
    });

    return list;
  }, [transactions, debouncedSearch, filters]);

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="page-title">Transactions</div>
            <div className="page-subtitle">{transactions.length} total transactions</div>
          </div>
          <Link to="/transactions/new" className="btn btn-primary">
            <RiAddLine size={16} /> Add New
          </Link>
        </div>

        {/* Search + Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          <SearchBar value={search} onChange={setSearch} />
          <Filters filters={filters} onChange={setFilters} />
        </div>

        {/* Results count */}
        {debouncedSearch && (
          <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 12 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{debouncedSearch}"
          </div>
        )}

        {/* List */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="empty-state card"
            >
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-text">No transactions found</div>
              <div className="empty-state-sub">Try adjusting your search or filters</div>
            </motion.div>
          ) : (
            filtered.map((t, i) => (
              <TransactionCard key={t.id} transaction={t} onDelete={deleteTransaction} index={i} />
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
