import prisma from "../../../shared/prisma";

const fetchDashboardMetaData = async () => {
    const userCount = await prisma.user.count();
    const packageCount = await prisma.subscriptionPackage.count();
    const fileCount = await prisma.file.count();
    const folderCount = await prisma.folder.count();
    const subscriptionCount = await prisma.userSubscription.count();

    return {
        userCount,
        packageCount,
        fileCount,
        folderCount,
        subscriptionCount
    };
};

export const MetaService = { fetchDashboardMetaData };
}