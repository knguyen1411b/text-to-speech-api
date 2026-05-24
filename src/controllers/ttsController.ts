import { Request, Response } from "express";
import { splitTextIntoChunks } from "../utils/textSplitter";

/**
 * Controller to handle Text-to-Speech conversion request.
 * Resolves the request by dividing long texts into chunks, fetching TTS audio from Google Translate API in parallel,
 * merging the resulting audio buffers, and sending the unified binary stream back as an attachment.
 */
export async function handleTTS(req: Request, res: Response) {
  const text = (req.body.text || req.query.text || "") as string;
  const lang = (req.body.lang || req.query.lang || "vi") as string;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      error: "Bad Request: 'text' parameter is required and cannot be empty.",
    });
  }

  const chunks = splitTextIntoChunks(text);

  try {
    const chunkBuffers = await Promise.all(
      chunks.map(async (chunk) => {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
          chunk
        )}&tl=${lang}&client=tw-ob`;

        const response = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });

        if (!response.ok) {
          throw new Error(`Google TTS request failed with status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      })
    );

    const combinedBuffer = Buffer.concat(chunkBuffers);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", 'attachment; filename="speech.mp3"');
    res.setHeader("Content-Length", combinedBuffer.length.toString());

    return res.send(combinedBuffer);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[TTS CONTROLLER ERROR]:", errorMessage);

    return res.status(500).json({
      error: "Internal Server Error during Text-to-Speech processing."
    });
  }
}
