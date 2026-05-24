"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTTS = handleTTS;
const textSplitter_1 = require("./textSplitter");
async function handleTTS(req, res) {
    const text = (req.body.text || req.query.text || "");
    const lang = (req.body.lang || req.query.lang || "vi");
    if (!text || text.trim().length === 0) {
        return res.status(450).json({
            error: "Bad Request!",
        });
    }
    const chunks = (0, textSplitter_1.splitTextIntoChunks)(text);
    try {
        const chunkBuffers = await Promise.all(chunks.map(async (chunk) => {
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${lang}&client=tw-ob`;
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
            });
            if (!response.ok) {
                throw new Error(`Google TTS trả về mã trạng thái: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer);
        }));
        const combinedBuffer = Buffer.concat(chunkBuffers);
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Disposition", 'attachment; filename="speech.mp3"');
        res.setHeader("Content-Length", combinedBuffer.length.toString());
        return res.send(combinedBuffer);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
        console.error("[LỖI TTS CONTROLLER]:", errorMessage);
        return res.status(500).json({
            error: "Internal Server Error!"
        });
    }
}
