import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FinanceContext } from "../context/FinanceContext";
import { saveTransactionRemote } from "../services/api";
import {
  RiMoneyDollarCircleLine, RiCalendarLine, RiPriceTagLine,
  RiFileTextLine, RiRepeatLine, RiCheckLine, RiLoader4Line
} from "react-icons/ri";

const CATEGORIES = [
  "Salary", "Freelance", "Investment", "Business",
  "Food", "Housing", "Transport", "Entertainment",
  "Shopping", "Utilities", "Health", "Education", "Travel", "Other"
];

const schema = yup.object({
  title: yup.string().required("Title is required").min(2, "At least 2 characters"),
  amount: yup.number()
    .typeError("Enter a valid amount")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  category: yup.string().required("Category is required"),
  type: yup.string().oneOf(["income", "expense"]).required(),
  date: yup.string().required("Date is required"),
  notes: yup.string(),
  recurring: yup.boolean(),
});

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AddTransaction() {
  const { addTransaction } = useContext(FinanceContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
      recurring: false,
    },
  });

  const typeValue = watch("type");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await saveTransactionRemote(data); // fire and forget mock API
      addTransaction({ ...data, amount: Number(data.amount) });
      toast.success("Transaction added successfully!");
      reset();
      navigate("/transactions");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      >
        <motion.div variants={fadeUp} className="page-header">
          <div className="page-title">Add Transaction</div>
          <div className="page-subtitle">Record a new income or expense</div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <div className="card" style={{ maxWidth: 560 }}>

            {/* Type Toggle */}
            <div style={{ marginBottom: 24 }}>
              <div className="form-label" style={{ marginBottom: 8 }}>Transaction Type</div>
              <div style={{
                display: "flex",
                background: "var(--surface2)",
                borderRadius: "var(--radius-sm)",
                padding: 4,
                gap: 4,
              }}>
                {["expense", "income"].map((t) => (
                  <label key={t} style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "9px 0", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 500,
                    background: typeValue === t
                      ? (t === "income" ? "var(--green)" : "var(--red)")
                      : "transparent",
                    color: typeValue === t ? "#fff" : "var(--text2)",
                    transition: "all 0.18s",
                    userSelect: "none",
                  }}>
                    <input type="radio" value={t} {...register("type")} style={{ display: "none" }} />
                    {t === "income" ? "💰 Income" : "💸 Expense"}
                  </label>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: "grid", gap: 18 }}>

                {/* Title */}
                <div className="form-group">
                  <label className="form-label">
                    <RiFileTextLine style={{ verticalAlign: "middle", marginRight: 4 }} />
                    Title *
                  </label>
                  <input
                    className="form-input"
                    placeholder="e.g. Monthly Salary, Grocery Run..."
                    {...register("title")}
                  />
                  {errors.title && <span className="form-error">{errors.title.message}</span>}
                </div>

                {/* Amount + Category row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">
                      <RiMoneyDollarCircleLine style={{ verticalAlign: "middle", marginRight: 4 }} />
                      Amount (₹) *
                    </label>
                    <input
                      className="form-input"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("amount")}
                    />
                    {errors.amount && <span className="form-error">{errors.amount.message}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <RiPriceTagLine style={{ verticalAlign: "middle", marginRight: 4 }} />
                      Category *
                    </label>
                    <select className="form-input" {...register("category")}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <span className="form-error">{errors.category.message}</span>}
                  </div>
                </div>

                {/* Date */}
                <div className="form-group">
                  <label className="form-label">
                    <RiCalendarLine style={{ verticalAlign: "middle", marginRight: 4 }} />
                    Date *
                  </label>
                  <input
                    className="form-input"
                    type="date"
                    {...register("date")}
                  />
                  {errors.date && <span className="form-error">{errors.date.message}</span>}
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <textarea
                    className="form-input"
                    placeholder="Any extra details..."
                    rows={3}
                    style={{ resize: "vertical" }}
                    {...register("notes")}
                  />
                </div>

                {/* Recurring checkbox */}
                <label style={{
                  display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                  padding: "12px 14px", background: "var(--surface2)", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                }}>
                  <input type="checkbox" {...register("recurring")} style={{ width: 16, height: 16, accentColor: "var(--accent)" }} />
                  <RiRepeatLine size={16} color="var(--purple)" />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>Recurring Transaction</div>
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>Mark if this repeats monthly</div>
                  </div>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ padding: "12px 0", fontSize: 15, justifyContent: "center" }}
                >
                  {loading
                    ? <><RiLoader4Line size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving...</>
                    : <><RiCheckLine size={16} /> Add Transaction</>
                  }
                </button>

              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
