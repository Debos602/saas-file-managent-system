import prisma from "../../../shared/prisma";
import { getActivePackageForUser, mapMimeToType } from "../../middlewares/subscriptionEnforcer";
import { fileUploader } from "../../../helpers/fileUploader";

const uploadFile = async (userId: string, folderId: string, file: Express.Multer.File) => {
    const pkg = await getActivePackageForUser(userId);

    // Determine type and size
    const type = mapMimeToType(file.originalname, file.mimetype);
    const sizeMB = Number((file.size / (1024 * 1024)).toFixed(2));

    if (pkg) {
        if (pkg.allowedFileTypes && pkg.allowedFileTypes.length > 0 && !pkg.allowedFileTypes.includes(type)) {
            throw new Error('File type not allowed in your subscription');
        }

        if (pkg.maxFileSizeMB && sizeMB > pkg.maxFileSizeMB) {
            throw new Error('File size exceeds subscription limit');
        }

        const totalFiles = await prisma.file.count({ where: { userId } });
        if (pkg.totalFileLimit && totalFiles >= pkg.totalFileLimit) {
            throw new Error('Total file limit reached for your subscription');
        }

        const filesInFolder = await prisma.file.count({ where: { folderId } });
        if (pkg.filesPerFolder && filesInFolder >= pkg.filesPerFolder) {
            throw new Error('Files per folder limit reached for your subscription');
        }
    }

    // Upload to cloud (or keep local) then create record
    const uploaded = await fileUploader.uploadToCloudinary(file);

    const data: any = {
        name: file.originalname,
        type,
        sizeMB,
        user: { connect: { id: userId } },
        ...(folderId ? { folder: { connect: { id: folderId } } } : {})
    };

    const record = await prisma.file.create({ data });

    return { record, uploaded };
};

const listFilesInFolder = async (folderId: string) => {
    return prisma.file.findMany({ where: { folderId }, orderBy: { createdAt: 'desc' } });
};

const getFileById = async (id: string) => {
    return prisma.file.findUnique({ where: { id } });
};

const deleteFile = async (id: string) => {
    await prisma.file.findUniqueOrThrow({ where: { id } });
    return prisma.file.delete({ where: { id } });
};

const renameFile = async (id: string, name: string) => {
    await prisma.file.findUniqueOrThrow({ where: { id } });
    return prisma.file.update({ where: { id }, data: { name } });
};

export const FileService = {
    uploadFile,
    listFilesInFolder,
    getFileById,
    deleteFile,
    renameFile
};
