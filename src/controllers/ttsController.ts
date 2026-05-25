import { Request, Response } from "express";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { Readable } from "stream";
import { splitTextIntoChunks } from "../utils/textSplitter";

const LANGUAGE_VOICE_MAP: Record<string, string> = {
  vi: "vi-VN-HoaiMyNeural",
  vi2: "vi-VN-NamMinhNeural",
  en: "en-US-AriaNeural",
  ja: "ja-JP-NanamiNeural",
  ko: "ko-KR-SunHiNeural",
  fr: "fr-FR-DeniseNeural",
  es: "es-ES-ElviraNeural",
};

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

/**
 * Controller to handle Text-to-Speech conversion request.
 * Resolves the request by dividing long texts into chunks, fetching TTS audio from Microsoft Edge API in parallel,
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

  let voice = lang;
  if (!voice.includes("-") || voice.split("-").length < 3) {
    const key = lang.split("-")[0].toLowerCase();
    voice = LANGUAGE_VOICE_MAP[key] || LANGUAGE_VOICE_MAP["vi"];
  }

  // Edge TTS supports larger chunk sizes; we use 2000 characters for natural phrasing context
  const chunks = splitTextIntoChunks(text, 2000);

  try {
    const chunkBuffers = await Promise.all(
      chunks.map(async (chunk) => {
        const tts = new MsEdgeTTS();
        await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
        const { audioStream } = tts.toStream(chunk);
        return await streamToBuffer(audioStream);
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
