import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../src/middlewares/auth";

describe("authMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
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
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    delete process.env.API_KEY;
    jest.restoreAllMocks();
  });

  it("should return 500 if API_KEY is not defined in the environment", () => {
    delete process.env.API_KEY;
    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining("Internal Server Error") })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should authenticate request with correct key in x-api-key header", () => {
    mockRequest.headers = { "x-api-key": testApiKey };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should authenticate request with correct key in authorization Bearer header", () => {
    mockRequest.headers = { authorization: `Bearer ${testApiKey}` };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it("should authenticate request with correct key in authorization plain header", () => {
    mockRequest.headers = { authorization: testApiKey };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it("should authenticate request with correct key in query parameter 'key'", () => {
    mockRequest.query = { key: testApiKey };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it("should return 401 if API key is missing", () => {
    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining("Unauthorized") })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return 401 if API key is incorrect", () => {
    mockRequest.headers = { "x-api-key": "invalid-key" };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
