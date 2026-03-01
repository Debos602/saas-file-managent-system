"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
// Sanitize error to prevent exposing sensitive information in production
const sanitizeError = (error) => {
    var _a;
    // Don't expose Prisma errors in production
    if (process.env.NODE_ENV === "production" && ((_a = error.code) === null || _a === void 0 ? void 0 : _a.startsWith("P"))) {
        return {
            message: "Database operation failed",
            errorDetails: null,
        };
    }
    return error;
};
const globalErrorHandler = (err, req, res, next) => {
    // Log error for internal diagnostics (do not expose to clients)
    console.error(err);
    let statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = (err === null || err === void 0 ? void 0 : err.message) || "Something went wrong!";
    // If it's our ApiError, use its values
    if (err instanceof ApiError_1.default) {
        statusCode = err.statusCode || statusCode;
        message = err.message || message;
        success = typeof err.success === 'boolean' ? err.success : false;
    }
    else {
        // Prisma specific handling
        if (err instanceof client_1.Prisma.PrismaClientValidationError) {
            message = 'Validation Error';
        }
        else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                message = "Duplicate Key error";
            }
        }
    }
    // Sanitize detail payload for production
    const isProd = process.env.NODE_ENV === 'production';
    const payload = { success, message };
    if (!isProd) {
        payload.originalError = sanitizeError(err);
        if (err && err.stack)
            payload.stack = err.stack;
    }
    res.status(statusCode).json(payload);
};
exports.default = globalErrorHandler;
