"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ttsRoutes_1 = __importDefault(require("./src/ttsRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", ttsRoutes_1.default);
app.get("/", (_req, res) => {
    res.json({
        message: "OK"
    });
});
if (!process.env.VERCEL) {
    const port = process.env.PORT || 3000;
    app.listen(port);
}
exports.default = app;
