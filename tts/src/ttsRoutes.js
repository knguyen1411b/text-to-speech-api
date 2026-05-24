"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./auth");
const ttsController_1 = require("./ttsController");
const router = (0, express_1.Router)();
router.route("/tts")
    .get(auth_1.authMiddleware, ttsController_1.handleTTS)
    .post(auth_1.authMiddleware, ttsController_1.handleTTS);
exports.default = router;
