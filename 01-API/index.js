import express from "express";
import userRoutes from "./src/routes/Userroutes.js";
import docRoutes from "./src/routes/Docroutes.js";
import empRoutes from "./src/routes/Emproutes.js";
import authRoutes from "./src/routes/AuthRoutes.js";
import contadorRoutes from "./src/routes/ContadorRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://192.168.15.9:8080",
      "https://domínio.em.producao",
    ],
  }),
); // porta do Vite

app.use(authRoutes);
app.use(userRoutes);
app.use(docRoutes);
app.use(empRoutes);
app.use(contadorRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
