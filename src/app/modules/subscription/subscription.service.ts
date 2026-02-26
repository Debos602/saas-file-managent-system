import prisma from "../../../shared/prisma";

const createPackage = async (data: any) => {
    const result = await prisma.subscriptionPackage.create({ data });
    return result;
};

const updatePackage = async (id: string, data: any) => {
    await prisma.subscriptionPackage.findUniqueOrThrow({ where: { id } });
    return prisma.subscriptionPackage.update({ where: { id }, data });
};

const deletePackage = async (id: string) => {
    await prisma.subscriptionPackage.findUniqueOrThrow({ where: { id } });
    return prisma.subscriptionPackage.delete({ where: { id } });
};

const getAllPackages = async () => {
    return prisma.subscriptionPackage.findMany({ orderBy: { createdAt: 'asc' } });
};

const getById = async (id: string) => {
    return prisma.subscriptionPackage.findUnique({ where: { id } });
};

const selectPackageForUser = async (userId: string, packageId: string) => {
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
