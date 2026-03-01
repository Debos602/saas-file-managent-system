"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const rateLimiter_1 = require("../../middlewares/rateLimiter");
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post('/login', rateLimiter_1.authLimiter, auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', auth_controller_1.AuthController.refreshToken);
router.get('/me', auth_controller_1.AuthController.getMe);
exports.AuthRoutes = router;
