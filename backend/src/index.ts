import express from "express";
import cors from "cors";
import "dotenv/config";

import { getHome, getHealth } from "./controllers/index.js";
import { createV1Router } from "./routes/v1/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", getHome);
app.get("/api/health", getHealth);

const v1Router = createV1Router();
app.use("/api/v1", v1Router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
