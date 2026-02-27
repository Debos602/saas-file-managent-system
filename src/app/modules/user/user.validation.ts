import { z } from "zod";

const createAdmin = z.object({
    password: z.string({ error: "Password is required" }),
    admin: z.object({
        name: z.string({ error: "Name is required" }),
        email: z.string({ error: "Email is required" }).email(),
        contactNumber: z.string().optional(),
    }),
});



const updateStatus = z.object({
    body: z.object({ role: z.enum(["ADMIN", "USER"]) }),
});

export const userValidation = {
    createAdmin,
    updateStatus,
};