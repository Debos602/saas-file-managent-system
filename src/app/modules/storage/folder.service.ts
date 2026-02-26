import prisma from "../../../shared/prisma";
import { getActivePackageForUser } from "../../middlewares/subscriptionEnforcer";

const createFolder = async (userId: string, name: string, parentId?: string) => {
    const pkg = await getActivePackageForUser(userId);

    const totalFolders = await prisma.folder.count({ where: { userId } });
    if (pkg && pkg.maxFolders !== null && totalFolders >= pkg.maxFolders) {
        throw new Error('Max folders limit reached for your subscription');
    }

    let level = 1;
    if (parentId) {
        const parent = await prisma.folder.findUniqueOrThrow({ where: { id: parentId } });
        level = parent.level + 1;
    }

    if (pkg && pkg.maxNestingLevel !== null && level > pkg.maxNestingLevel) {
        throw new Error('Max nesting level exceeded for your subscription');
    }

    const folder = await prisma.folder.create({ data: { name, userId, parentId: parentId ?? null, level } });
    return folder;
};

const listFolderChildren = async (id: string) => {
    return prisma.folder.findMany({ where: { parentId: id } });
};

const getRootFolders = async (userId: string) => {
    return prisma.folder.findMany({ where: { userId, parentId: null } });
};

const renameFolder = async (id: string, name: string) => {
    await prisma.folder.findUniqueOrThrow({ where: { id } });
    return prisma.folder.update({ where: { id }, data: { name } });
};

const deleteFolder = async (id: string) => {
    await prisma.folder.findUniqueOrThrow({ where: { id } });
    return prisma.folder.delete({ where: { id } });
};

export const FolderService = {
    createFolder,
    listFolderChildren,
    getRootFolders,
    renameFolder,
    deleteFolder
};
