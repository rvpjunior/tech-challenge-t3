import express from "express";
import cors from "cors"
import { DatabaseClient } from "./DatabaseClient";

const app = express();
app.use(cors());
const port = 4000;

const region = process.env.AWS_REGION ?? "ap-southeast-2";
const database = process.env.DATABASE_NAME ?? "";
const outputBucket = process.env.OUTPUT_BUCKET ?? "";

app.get("/anomalies", async (req, res) => {
  const databaseClient = new DatabaseClient(
    database,
    outputBucket,
    region
  );

  try {
    const query = "SELECT * FROM output ORDER BY datempenho DESC LIMIT 20";
    const queryResults = await databaseClient.runAthenaQuery(query);
    res.json({ anomalies: queryResults });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An error occurred" });
    }
  }
});

app.get("/transactions", async (req, res) => {

  const numcpfcnpj = req.query.numcpfcnpj;

  if(!numcpfcnpj) {
    res.status(400).json({ error: "Missing required parameter numcpfcnpj" });
    return;
  }

  const databaseClient = new DatabaseClient(
    database,
    outputBucket,
    region
  );

  try {
    
    const query = `SELECT * FROM raw WHERE numcpfcnpj = '${numcpfcnpj}' ORDER BY datempenho DESC LIMIT 20`;
    const queryResults = await databaseClient.runAthenaQuery(query);
    res.json({ transactions: queryResults });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An error occurred" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
