"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../src/middlewares/auth");
describe("authMiddleware", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction = jest.fn();
    const testApiKey = "test-secret-key";
    beforeEach(() => {
        process.env.API_KEY = testApiKey;
        mockRequest = {
            headers: {},
            query: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunction = jest.fn();
    });
    afterEach(() => {
        delete process.env.API_KEY;
    });
    it("should return 500 if API_KEY is not defined in the environment", () => {
        delete process.env.API_KEY;
        (0, auth_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining("Internal Server Error") }));
        expect(nextFunction).not.toHaveBeenCalled();
    });
    it("should authenticate request with correct key in x-api-key header", () => {
        mockRequest.headers = { "x-api-key": testApiKey };
        (0, auth_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
    });
    it("should authenticate request with correct key in authorization Bearer header", () => {
        mockRequest.headers = { authorization: `Bearer ${testApiKey}` };
        (0, auth_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
    });
    it("should authenticate request with correct key in authorization plain header", () => {
        mockRequest.headers = { authorization: testApiKey };
        (0, auth_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
    });
    it("should authenticate request with correct key in query parameter 'key'", () => {
        mockRequest.query = { key: testApiKey };
        (0, auth_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
    });
    it("should return 401 if API key is missing", () => {
        (0, auth_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining("Unauthorized") }));
        expect(nextFunction).not.toHaveBeenCalled();
    });
    it("should return 401 if API key is incorrect", () => {
        mockRequest.headers = { "x-api-key": "invalid-key" };
        (0, auth_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(nextFunction).not.toHaveBeenCalled();
    });
});
