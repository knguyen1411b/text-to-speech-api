"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const textSplitter_1 = require("../src/utils/textSplitter");
describe("splitTextIntoChunks utility", () => {
    it("should return an empty array for empty or whitespace-only inputs", () => {
        expect((0, textSplitter_1.splitTextIntoChunks)("")).toEqual([]);
        expect((0, textSplitter_1.splitTextIntoChunks)("   ")).toEqual([]);
    });
    it("should return the entire text as a single chunk if it is shorter than maxLength", () => {
        const text = "Hello world. This is a test.";
        const chunks = (0, textSplitter_1.splitTextIntoChunks)(text, 100);
        expect(chunks).toEqual([text]);
    });
    it("should split text at sentence boundaries when length exceeds maxLength", () => {
        const s1 = "This is the first sentence.";
        const s2 = "This is the second sentence, which is somewhat longer.";
        const text = `${s1} ${s2}`;
        // Split with maxLength 40: s1 is 27 chars, s2 is 54 chars
        // Expected to group s1 as one chunk, and s2 will be split further because it's longer than 40
        const chunks = (0, textSplitter_1.splitTextIntoChunks)(text, 40);
        expect(chunks[0]).toBe(s1);
    });
    it("should fallback to splitting by words if a sentence is longer than maxLength", () => {
        const sentence = "Supercalifragilisticexpialidocious is a very long word indeed.";
        // Length is 62. Split with maxLength 40.
        const chunks = (0, textSplitter_1.splitTextIntoChunks)(sentence, 40);
        // It should split into words, ensuring no chunk exceeds 40 chars
        expect(chunks.length).toBeGreaterThan(1);
        chunks.forEach(chunk => {
            expect(chunk.length).toBeLessThanOrEqual(40);
        });
    });
    it("should split a single word hard if it exceeds maxLength", () => {
        const longWord = "12345678901234567890"; // 20 chars
        const chunks = (0, textSplitter_1.splitTextIntoChunks)(longWord, 5);
        expect(chunks).toEqual(["12345", "67890", "12345", "67890"]);
    });
});
