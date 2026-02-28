import { z } from "zod";

const createUser = z.preprocess((input) => {
    if (typeof input === 'object' && input !== null) {
        const obj = input as any;
        if (obj.admin) return obj;
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
}, z.object({
    password: z.string({ error: "Password is required" }),
    admin: z.object({
        name: z.string({ error: "Name is required" }),
        email: z.string({ error: "Email is required" }).email(),
        contactNumber: z.string().optional(),
    }),
}));



const updateStatus = z.object({
    body: z.object({ role: z.enum(["ADMIN", "USER"]) }),
});

export const userValidation = {
    createUser,
    updateStatus,
};