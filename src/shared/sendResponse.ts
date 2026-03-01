import { Response } from 'express';

export type PaginationMeta = {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
};

export type SendResponseOptions<T> = {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
    meta?: PaginationMeta;
};

/**
 * Standardized response helper used across controllers.
 * Only includes `data` and `meta` when present to keep payload small.
 */
const sendResponse = <T = any>(res: Response, opts: SendResponseOptions<T>) => {
    const { statusCode, success, message, data, meta } = opts;

    const payload: { success: boolean; message: string; data?: T; meta?: PaginationMeta; } = {
        success,
        message
    };

    if (typeof data !== 'undefined') payload.data = data;
    if (typeof meta !== 'undefined') payload.meta = meta;

    return res.status(statusCode).json(payload);
};

export default sendResponse;