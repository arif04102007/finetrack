export const useCurrency = () => {
  const format = (amount, compact = false) => {
    const num = Number(amount);
    if (compact && num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    }
    if (compact && num >= 1000) {
      return `₹${(num / 1000).toFixed(1)}K`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return { format };
};
