"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
function authMiddleware(req, res, next) {
    const systemApiKey = process.env.API_KEY;
    if (!systemApiKey) {
        return res.status(500).json({
            error: "Internal Server Error!",
        });
    }
    const apiKeyFromHeader = req.headers["x-api-key"];
    let apiKeyFromAuthHeader;
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        if (authHeader.startsWith("Bearer ")) {
            apiKeyFromAuthHeader = authHeader.substring(7);
        }
        else {
            apiKeyFromAuthHeader = authHeader;
        }
    }
    const apiKeyFromQuery = req.query.key;
    const providedKey = apiKeyFromHeader || apiKeyFromAuthHeader || apiKeyFromQuery;
    if (!providedKey || providedKey !== systemApiKey) {
        return res.status(401).json({
            error: "Unauthorized!",
        });
    }
    next();
}
