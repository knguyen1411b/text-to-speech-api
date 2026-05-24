/**
 * Splits a long text string into smaller chunks appropriate for the Google TTS API (which has a limit of 200 characters).
 * It preserves sentence boundaries when possible, and falls back to word boundaries or hard splitting if sentences or words are too long.
 *
 * @param text The input text to be split.
 * @param maxLength The maximum allowed length of each chunk (default is 200 characters).
 * @returns An array of string chunks.
 */
export function splitTextIntoChunks(text: string, maxLength: number = 200): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  // Split by sentence boundaries (periods, exclamation marks, question marks, semicolons followed by whitespace, or newlines)
  const sentences = text.split(/(?<=[.?!;\n])\s+|\n+/);

  for (const sentence of sentences) {
    if (sentence.length <= maxLength) {
      if ((currentChunk + " " + sentence).trim().length <= maxLength) {
        currentChunk = (currentChunk + " " + sentence).trim();
      } else {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence;
      }
    } else {
      // If a single sentence exceeds the maxLength, split it by words
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

          // If a single word/sequence is longer than maxLength, split it hard
          if (word.length > maxLength) {
            let remaining = word;
            while (remaining.length > maxLength) {
              chunks.push(remaining.substring(0, maxLength));
              remaining = remaining.substring(maxLength);
            }
            currentChunk = remaining;
          } else {
            currentChunk = word;
          }
        } else {
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
