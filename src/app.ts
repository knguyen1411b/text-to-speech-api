import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import ttsRoutes from "./routes/ttsRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), "public")));

app.use("/api", ttsRoutes);

app.get("/", (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public/index.html"));
});

export default app;
