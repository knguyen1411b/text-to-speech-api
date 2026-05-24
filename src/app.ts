import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import ttsRoutes from "./routes/ttsRoutes";

// Load environment variables
dotenv.config();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public/ folder at root
app.use(express.static(path.join(process.cwd(), "public")));

// API Route Registration
app.use("/api", ttsRoutes);

// Root endpoint serves the interactive playground
app.get("/", (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public/index.html"));
});

export default app;
