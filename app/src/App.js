import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { getAnomalies } from "./requests/getAnomalies";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@mui/material";
import { useState } from "react";

const App = () => {
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const { data: anomalies, isLoading } = useQuery({
    queryKey: ["anomalies"],
    queryFn: getAnomalies,
  });

  if (isLoading || anomalies === undefined) {
    return (
      <div
        style={{
          padding: 64,
          backgroundColor: "rgba(246, 247, 248, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Carregando...
        </Typography>
      </div>
    );
  }

  if (selectedAnomaly) {
    return (
      <div style={{ padding: 64, backgroundColor: "rgba(246, 247, 248, 0.5)" }}>
        <Typography variant="h3" gutterBottom>
          Sistema de Detecção de Fraude
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Data
        </Typography>
        <Typography variant="body1" gutterBottom>
          {selectedAnomaly.datempenho}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Empresa Pagadora
        </Typography>
        <Typography variant="body1" gutterBottom>
          {selectedAnomaly.nomempresa}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Empresa Recebedora
        </Typography>
        <Typography variant="body1" gutterBottom>
          {selectedAnomaly.txtrazaosocial} ({selectedAnomaly.numcpfcnpj})
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Orgao
        </Typography>
        <Typography variant="body1" gutterBottom>
          {selectedAnomaly.txdescricaoorgao}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Unidade
        </Typography>
        <Typography variant="body1" gutterBottom>
          {selectedAnomaly.txdescricaounidade}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Funcao
        </Typography>
        <Typography variant="body1" gutterBottom>
          {selectedAnomaly.txdescricaofuncao}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Programa
        </Typography>
        <Typography variant="body1" gutterBottom>
          {selectedAnomaly.txdescricaoprograma}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Valor
        </Typography>
        <Typography variant="body1" gutterBottom>
          R$ {selectedAnomaly.valpagoexercicio + selectedAnomaly.valpagorestos}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedAnomaly(null);
          }}
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 64, backgroundColor: "rgba(246, 247, 248, 0.5)" }}>
      <Typography variant="h3" gutterBottom>
        Sistema de Detecção de Fraude
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Companhia</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Detalhes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {anomalies.map((row) => (
              <TableRow key={row.txtrazaosocial}>
                <TableCell component="th" scope="row">
                  {row.txtrazaosocial}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.datempenho}
                </TableCell>
                <TableCell component="th" scope="row">
                  R$ {row.valpagoexercicio}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSelectedAnomaly(row);
                    }}
                  >
                    Visualizar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default App;
