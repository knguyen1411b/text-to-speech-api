import request from "supertest";
import app from "../src/app";

describe("TTS API endpoints", () => {
  const testApiKey = "test-secret-key";
  let originalFetch: typeof global.fetch;
  let mockFetch: jest.Mock;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  beforeEach(() => {
    process.env.API_KEY = testApiKey;
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    delete process.env.API_KEY;
    jest.restoreAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("should return the HTML playground page on GET /", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.text).toContain("<!DOCTYPE html>");
  });

  it("should return 401 if request is unauthorized", async () => {
    const response = await request(app)
      .get("/api/tts")
      .query({ text: "Hello", lang: "en" });

    expect(response.status).toBe(401);
    expect(response.body.error).toContain("Unauthorized");
  });

  it("should return 400 if text parameter is missing", async () => {
    const response = await request(app)
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

    const response = await request(app)
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

    const response = await request(app)
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

    const response = await request(app)
      .get("/api/tts")
      .query({ key: testApiKey, text: "Hello error", lang: "en" });

    expect(response.status).toBe(500);
    expect(response.body.error).toContain("Internal Server Error");
  });
});
