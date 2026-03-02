import { Prisma, SubscriptionPackage } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import ApiError from "../../errors/ApiError";

const createPackage = async (payload: Prisma.SubscriptionPackageCreateInput): Promise<SubscriptionPackage> => {
    const result = await prisma.subscriptionPackage.create({
        data: payload
    });
    return result;
};

const updatePackage = async (id: string, data: Prisma.SubscriptionPackageCreateInput) => {
    await prisma.subscriptionPackage.findUniqueOrThrow({ where: { id } });
    return prisma.subscriptionPackage.update({ where: { id }, data });
};

const deletePackage = async (id: string) => {
    await prisma.subscriptionPackage.findUniqueOrThrow({ where: { id } });
    return prisma.subscriptionPackage.delete({ where: { id } });
};

const getAllPackages = async (options?: { page?: number; limit?: number; sortBy?: string; sortOrder?: string; }) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options || {});

    // Use Promise.all instead of $transaction to avoid transaction startup timeouts
    const [data, total] = await Promise.all([
        prisma.subscriptionPackage.findMany({
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder as any }
        }),
        prisma.subscriptionPackage.count()
    ]);

    return {
        meta: {
            page,
            limit,
            total
        },
        data
    };
};

const getById = async (id: string) => {
    return prisma.subscriptionPackage.findUnique({ where: { id } });
};

const selectPackageForUser = async (userId: string, packageId: string) => {
    if (!userId) {
        throw new ApiError(401, 'User authentication required');
    }

    if (!packageId) {
        throw new ApiError(400, 'packageId is required');
    }

    // End previous active subscription
    await prisma.userSubscription.updateMany({
        where: { userId, endDate: null },
        data: { endDate: new Date() }
    });

    const subscription = await prisma.userSubscription.create({
        data: { userId, packageId }
    });

    return subscription;
};

const getUserSubscriptions = async (userId: string) => {
    return prisma.userSubscription.findMany({ where: { userId }, include: { package: true } });
};

export const SubscriptionService = {
    createPackage,
    updatePackage,
    deletePackage,
    getAllPackages,
    getById,
    selectPackageForUser,
    getUserSubscriptions
};
