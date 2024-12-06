import axios from "axios";

export const getAnomalies = async () => {
  try {
    const response = await axios.get("http://localhost:4000/anomalies");
    return response.data.anomalies;
  } catch (error) {
    console.error("Error fetching anomalies:", error);
    throw error;
  }
};
