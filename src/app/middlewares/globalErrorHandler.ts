import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../errors/ApiError";

// Sanitize error to prevent exposing sensitive information in production
const sanitizeError = (error: any) => {
    // Don't expose Prisma errors in production
    if (process.env.NODE_ENV === "production" && error.code?.startsWith("P")) {
        return {
            message: "Database operation failed",
            errorDetails: null,
        };
    }
    return error;
};

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    // Log error for internal diagnostics (do not expose to clients)
    console.error(err);

    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err?.message || "Something went wrong!";

    // If it's our ApiError, use its values
    if (err instanceof ApiError) {
        statusCode = err.statusCode || statusCode;
        message = err.message || message;
        success = typeof err.success === 'boolean' ? err.success : false;
    }
    else {
        // Prisma specific handling
        if (err instanceof Prisma.PrismaClientValidationError) {
            message = 'Validation Error';
        }
        else if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                message = "Duplicate Key error";
            }
        }
    }

    // Sanitize detail payload for production
    const isProd = process.env.NODE_ENV === 'production';

    const payload: any = { success, message };

    if (!isProd) {
        payload.originalError = sanitizeError(err);
        if (err && err.stack) payload.stack = err.stack;
    }

    res.status(statusCode).json(payload);
};

export default globalErrorHandler;