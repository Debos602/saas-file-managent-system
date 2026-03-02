import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

// Admin Actions

const createPackage = catchAsync(async (req: Request, res: Response) => {
    const data = req.body;
    const result = await SubscriptionService.createPackage(data);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Subscription package created',
        data: result
    });
});

const updatePackage = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    const result = await SubscriptionService.updatePackage(id, data);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Subscription package updated',
        data: result
    });
});

const deletePackage = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await SubscriptionService.deletePackage(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Subscription package deleted',
        data: result
    });
});

const getAllPackages = catchAsync(async (req: Request, res: Response) => {
    const options = {
        page: req.query.page as any,
        limit: req.query.limit as any,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
    };

    const result = await SubscriptionService.getAllPackages(options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Subscription packages fetched',
        meta: result.meta,
        data: result.data
    });
});

const getById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await SubscriptionService.getById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Subscription package fetched',
        data: result
    });
});

// user Actions

const selectPackage = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { packageId } = req.body;

    const result = await SubscriptionService.selectPackageForUser(user.id, packageId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Package selected for user',
        data: result
    });
});

const getUserSubscriptions = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await SubscriptionService.getUserSubscriptions(user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User subscriptions fetched',
        data: result
    });
});

export const SubscriptionController = {
    createPackage,
    updatePackage,
    deletePackage,
    getAllPackages,
    getById,
    selectPackage,
    getUserSubscriptions
};
