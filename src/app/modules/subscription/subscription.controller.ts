import { Request, Response } from "express";
import { SubscriptionService } from "./subscription.service";

// Admin Actions

const createPackage = async (req: Request, res: Response) => {
    const data = req.body;
    const result = await SubscriptionService.createPackage(data);
    res.json(result);
};

const updatePackage = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    const result = await SubscriptionService.updatePackage(id, data);
    res.json(result);
};

const deletePackage = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await SubscriptionService.deletePackage(id);
    res.json(result);
};

const getAllPackages = async (_req: Request, res: Response) => {
    const result = await SubscriptionService.getAllPackages();
    res.json(result);
};

const getById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await SubscriptionService.getById(id);
    res.json(result);
};

//user Actions


const selectPackage = async (req: Request, res: Response) => {
    const user = (req as any).user;
    console.log("user", user);
    const { packageId } = req.body;
    const result = await SubscriptionService.selectPackageForUser(user.id, packageId);
    res.json(result);
};

const getUserSubscriptions = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await SubscriptionService.getUserSubscriptions(user.id);
    res.json(result);
};

export const SubscriptionController = {
    createPackage,
    updatePackage,
    deletePackage,
    getAllPackages,
    getById,
    selectPackage,
    getUserSubscriptions
};
