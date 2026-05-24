"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe("TTS API endpoints", () => {
    const testApiKey = "test-secret-key";
    let originalFetch;
    let mockFetch;
    beforeAll(() => {
        originalFetch = global.fetch;
    });
    beforeEach(() => {
        process.env.API_KEY = testApiKey;
        mockFetch = jest.fn();
        global.fetch = mockFetch;
    });
    afterEach(() => {
        delete process.env.API_KEY;
    });
    afterAll(() => {
        global.fetch = originalFetch;
    });
    it("should return 401 if request is unauthorized", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/api/tts")
            .query({ text: "Hello", lang: "en" });
        expect(response.status).toBe(401);
        expect(response.body.error).toContain("Unauthorized");
    });
    it("should return 400 if text parameter is missing", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/api/tts")
            .query({ key: testApiKey, lang: "en" });
        expect(response.status).toBe(400);
        expect(response.body.error).toContain("required");
    });
    it("should successfully generate TTS and merge buffers on GET request", async () => {
        const dummyAudio = Buffer.from([1, 2, 3, 4]);
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            arrayBuffer: async () => dummyAudio.buffer.slice(dummyAudio.byteOffset, dummyAudio.byteOffset + dummyAudio.byteLength),
        });
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/api/tts")
            .query({ key: testApiKey, text: "Xin chào", lang: "vi" });
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toBe("audio/mpeg");
        expect(response.headers["content-disposition"]).toContain('filename="speech.mp3"');
        expect(response.body).toEqual(dummyAudio);
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
    it("should successfully generate TTS on POST request with header auth", async () => {
        const dummyAudio = Buffer.from([5, 6, 7, 8]);
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            arrayBuffer: async () => dummyAudio.buffer.slice(dummyAudio.byteOffset, dummyAudio.byteOffset + dummyAudio.byteLength),
        });
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/tts")
            .set("x-api-key", testApiKey)
            .send({ text: "Hello world", lang: "en" });
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toBe("audio/mpeg");
        expect(response.body).toEqual(dummyAudio);
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
    it("should return 500 if external Google TTS request fails", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 502,
        });
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/api/tts")
            .query({ key: testApiKey, text: "Hello error", lang: "en" });
        expect(response.status).toBe(500);
        expect(response.body.error).toContain("Internal Server Error");
    });
});
