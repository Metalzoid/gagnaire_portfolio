import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "dotenv/config";

import { getHome, getHealth } from "./controllers/index.js";
import { createV1Router } from "./routes/v1/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3001;

// En local : autoriser localhost et 127.0.0.1 pour éviter les blocages CORS des previews
const corsOrigins =
  process.env.CORS_ORIGIN ||
  (process.env.NODE_ENV === "development"
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : "http://localhost:3000");
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Servir les fichiers uploadés (images, CV, etc.)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", getHome);
app.get("/api/health", getHealth);

const v1Router = createV1Router();
app.use("/api/v1", v1Router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
