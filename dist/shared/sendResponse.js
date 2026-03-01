"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Standardized response helper used across controllers.
 * Only includes `data` and `meta` when present to keep payload small.
 */
const sendResponse = (res, opts) => {
    const { statusCode, success, message, data, meta } = opts;
    const payload = {
        success,
        message
    };
    if (typeof data !== 'undefined')
        payload.data = data;
    if (typeof meta !== 'undefined')
        payload.meta = meta;
    return res.status(statusCode).json(payload);
};
exports.default = sendResponse;
