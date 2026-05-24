"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitTextIntoChunks = splitTextIntoChunks;
function splitTextIntoChunks(text, maxLength = 200) {
    const chunks = [];
    let currentChunk = "";
    const sentences = text.split(/(?<=[.?!;\n])\s+|\n+/);
    for (const sentence of sentences) {
        if (sentence.length <= maxLength) {
            if ((currentChunk + " " + sentence).trim().length <= maxLength) {
                currentChunk = (currentChunk + " " + sentence).trim();
            }
            else {
                if (currentChunk.trim()) {
                    chunks.push(currentChunk.trim());
                }
                currentChunk = sentence;
            }
        }
        else {
            if (currentChunk.trim()) {
                chunks.push(currentChunk.trim());
                currentChunk = "";
            }
            const words = sentence.split(/(\s+)/);
            for (const word of words) {
                if ((currentChunk + word).length > maxLength) {
                    if (currentChunk.trim()) {
                        chunks.push(currentChunk.trim());
                    }
                    if (word.length > maxLength) {
                        let remaining = word;
                        while (remaining.length > maxLength) {
                            chunks.push(remaining.substring(0, maxLength));
                            remaining = remaining.substring(maxLength);
                        }
                        currentChunk = remaining;
                    }
                    else {
                        currentChunk = word;
                    }
                }
                else {
                    currentChunk += word;
                }
            }
        }
    }
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    return chunks.filter((c) => c.length > 0);
}
