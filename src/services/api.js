import axios from "axios";

const BASE_URL = "https://api.exchangerate-api.com/v4/latest/INR";

export const getExchangeRates = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (err) {
    console.error("Exchange rate fetch failed:", err);
    return null;
  }
};

// Mock transaction save (using jsonplaceholder)
export const saveTransactionRemote = async (data) => {
  try {
    const res = await axios.post("https://jsonplaceholder.typicode.com/posts", data);
    return res.data;
  } catch (err) {
    console.error("Remote save failed:", err);
    return null;
  }
};
