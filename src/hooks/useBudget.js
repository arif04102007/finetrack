import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";

export const useBudget = () => {
  const { budget, setBudget, transactions } = useContext(FinanceContext);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const remaining = budget - expense;
  const percentage = budget > 0 ? Math.min((expense / budget) * 100, 100) : 0;
  const isOver = expense > budget;
  const isWarning = percentage >= 80;

  return { budget, setBudget, expense, remaining, percentage, isOver, isWarning };
};
