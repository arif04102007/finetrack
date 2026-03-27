import { createContext, useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export const FinanceContext = createContext();

const STORAGE_KEY = "financeApp_data";

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
};

export const FinanceProvider = ({ children }) => {
  const stored = loadFromStorage();
  const [transactions, setTransactions] = useState(stored?.transactions ?? []);
  const [budget, setBudgetState] = useState(stored?.budget ?? 50000);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, budget }));
  }, [transactions, budget]);

  const addTransaction = useCallback((data) => {
    setTransactions(prev => [{ ...data, id: uuidv4() }, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTransaction = useCallback((id, data) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

  const setBudget = useCallback((val) => {
    setBudgetState(Number(val));
  }, []);

  return (
    <FinanceContext.Provider value={{
      transactions,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      budget,
      setBudget,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};