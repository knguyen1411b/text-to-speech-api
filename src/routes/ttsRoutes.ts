import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { handleTTS } from "../controllers/ttsController";

const router = Router();

// Secure TTS endpoint for both GET and POST requests
router.route("/tts")
  .get(authMiddleware, handleTTS)
  .post(authMiddleware, handleTTS);

export default router;
