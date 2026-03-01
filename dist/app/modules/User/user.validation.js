"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const createUser = zod_1.z.preprocess((input) => {
    if (typeof input === 'object' && input !== null) {
        const obj = input;
        if (obj.admin)
            return obj;
        if (obj.name && obj.email) {
            return {
                password: obj.password,
                admin: {
                    name: obj.name,
                    email: obj.email,
                    contactNumber: obj.contactNumber,
                }
            };
        }
    }
    return input;
}, zod_1.z.object({
    password: zod_1.z.string({ error: "Password is required" }),
    admin: zod_1.z.object({
        name: zod_1.z.string({ error: "Name is required" }),
        email: zod_1.z.string({ error: "Email is required" }).email(),
        contactNumber: zod_1.z.string().optional(),
    }),
}));
const updateStatus = zod_1.z.object({
    body: zod_1.z.object({ role: zod_1.z.enum(["ADMIN", "USER"]) }),
});
exports.userValidation = {
    createUser,
    updateStatus,
};
