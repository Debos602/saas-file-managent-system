import { z } from "zod";

const createAdmin = z.object({
    password: z.string({ error: "Password is required" }),
    admin: z.object({
        name: z.string({ error: "Name is required" }),
        email: z.string({ error: "Email is required" }).email(),
        contactNumber: z.string().optional(),
    }),
});

const createDoctor = z.object({
    password: z.string({ error: "Password is required" }),
    doctor: z.object({
        name: z.string({ error: "Name is required" }),
        email: z.string({ error: "Email is required" }).email(),
        contactNumber: z.string().optional(),
    }),
});

const createPatient = z.object({
    password: z.string({ error: "Password is required" }),
    patient: z.object({
        email: z.string({ error: "Email is required" }).email(),
        name: z.string({ error: "Name is required" }),
        contactNumber: z.string().optional(),
        address: z.string().optional(),
    }),
});

const updateStatus = z.object({
    body: z.object({ role: z.enum(["ADMIN", "USER"]) }),
});

export const userValidation = {
    createAdmin,
    createDoctor,
    createPatient,
    updateStatus,
};