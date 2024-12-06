import {
  StartQueryExecutionCommand,
  AthenaClient,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
  ResultSet,
} from "@aws-sdk/client-athena";

export class DatabaseClient {
  client: AthenaClient;

  constructor(
    private database: string,
    private outputBucket: string,
    region: string
  ) {
    this.client = new AthenaClient({ region });
  }

  private parseAthenaResultsToJSON(resultSet: ResultSet) {
    const rows = resultSet.Rows;
    if (rows === undefined) return [];

    const headers = rows[0].Data?.map((header) => header.VarCharValue) ?? [];

    const data = rows.slice(1).map((row) => {
      const values = row.Data?.map((cell) => cell.VarCharValue || null) ?? [];
      return headers.reduce((acc: { [key: string]: any }, header, index) => {
        if (header !== undefined) acc[header] = values[index];
        return acc;
      }, {});
    });

    return data;
  }

  private async startQuery(query: string) {
    const params = {
      QueryString: query,
      QueryExecutionContext: {
        Database: this.database,
      },
      ResultConfiguration: {
        OutputLocation: this.outputBucket,
      },
    };

    const startCommand = new StartQueryExecutionCommand(params);
    const startResponse = await this.client.send(startCommand);
    return startResponse.QueryExecutionId;
  }

  private async checkQueryStatus(queryExecutionId: string) {
    const statusCommand = new GetQueryExecutionCommand({
      QueryExecutionId: queryExecutionId,
    });
    const statusResponse = await this.client.send(statusCommand);

    const status = statusResponse.QueryExecution?.Status?.State;

    return status ?? "RUNNING";
  }

  private async getQueryResults(queryExecutionId: string) {
    const resultsCommand = new GetQueryResultsCommand({
      QueryExecutionId: queryExecutionId,
    });
    const resultsResponse = await this.client.send(resultsCommand);


    return resultsResponse.ResultSet
      ? this.parseAthenaResultsToJSON(resultsResponse.ResultSet)
      : [];
  }

  public async runAthenaQuery(query: string) {
    const queryExecutionId = await this.startQuery(query);

    if (queryExecutionId === undefined) {
      throw new Error("Query execution failed");
    }

    let status = "RUNNING";
    while (status === "RUNNING" || status === "QUEUED") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      status = await this.checkQueryStatus(queryExecutionId);
    }

    if (status === "SUCCEEDED") {
      const results = await this.getQueryResults(queryExecutionId);
      return results;
    }
    throw new Error("Query execution failed");
  }
}
