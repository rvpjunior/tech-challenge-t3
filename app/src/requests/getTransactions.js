import axios from "axios";

export const getTransactions = async (organisation) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/transactions?numcpfcnpj=${organisation}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
