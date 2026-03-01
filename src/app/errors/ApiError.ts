class ApiError extends Error {
    statusCode: number;
    success: boolean;
    constructor(statusCode: number, message?: string, success = false, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.success = success;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;