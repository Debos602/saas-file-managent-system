"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createAdmin = zod_1.z.object({
    password: zod_1.z.string({
        error: "Password is required",
    }),
    admin: zod_1.z.object({
        name: zod_1.z.string({
            error: "Name is required!",
        }),
        email: zod_1.z.string({
            error: "Email is required!",
        }),
        contactNumber: zod_1.z.string({
            error: "Contact Number is required!",
        }),
    }),
});
const updateStatus = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([client_1.UserStatus.ACTIVE, client_1.UserStatus.BLOCKED, client_1.UserStatus.DELETED]),
    }),
});
exports.userValidation = {
    createAdmin,
    
    updateStatus,
};
