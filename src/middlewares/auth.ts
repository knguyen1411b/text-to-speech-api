import { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const systemApiKey = process.env.API_KEY;

  if (!systemApiKey) {
    console.error("[AUTH ERROR]: API_KEY environment variable is not configured.");
    return res.status(500).json({
      error: "Internal Server Error: API authentication is not configured.",
    });
  }

  const apiKeyFromHeader = req.headers["x-api-key"] as string | undefined;

  let apiKeyFromAuthHeader: string | undefined;
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      apiKeyFromAuthHeader = authHeader.substring(7);
    } else {
      apiKeyFromAuthHeader = authHeader;
    }
  }

  const apiKeyFromQuery = req.query.key as string | undefined;

  const providedKey = apiKeyFromHeader || apiKeyFromAuthHeader || apiKeyFromQuery;

  if (!providedKey || providedKey !== systemApiKey) {
    return res.status(401).json({
      error: "Unauthorized: Invalid or missing API key.",
    });
  }

  next();
}
