// useTransactions.js
import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";

export const useTransactions = () => {
  const { transactions, addTransaction, deleteTransaction, updateTransaction } = useContext(FinanceContext);

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = income - expense;

  const byCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    income,
    expense,
    balance,
    byCategory,
    topCategory,
  };
};
