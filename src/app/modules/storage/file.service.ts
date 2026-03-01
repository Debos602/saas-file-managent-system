import prisma from "../../../shared/prisma";
import { getActivePackageForUser, mapMimeToType } from "../../middlewares/subscriptionEnforcer";
import { fileUploader } from "../../../helpers/fileUploader";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const uploadFile = async (userId: string, folderId: string, file: Express.Multer.File) => {
    const pkg = await getActivePackageForUser(userId);

    // Determine type and size
    const type = mapMimeToType(file.originalname, file.mimetype);
    const sizeMB = Number((file.size / (1024 * 1024)).toFixed(2));

    if (pkg) {

        if (pkg.allowedFileTypes && pkg.allowedFileTypes.length > 0) {
            const normalizedAllowed = pkg.allowedFileTypes.map((t: string) => t.toLowerCase().trim());
            const typeLower = (type || '').toLowerCase();
            const mimeLower = (file.mimetype || '').toLowerCase();
            const ext = (file.originalname || '').split('.').pop()?.toLowerCase() || '';

            const allowed = normalizedAllowed.includes(typeLower)
                || normalizedAllowed.includes(mimeLower)
                || normalizedAllowed.some((a: string) => mimeLower.startsWith(a + '/'))
                || (ext && normalizedAllowed.includes(ext));

            if (!allowed) {
                throw new ApiError(httpStatus.FORBIDDEN, 'File type not allowed in your subscription');
            }
        }

        if (pkg.maxFileSizeMB && sizeMB > pkg.maxFileSizeMB) {
            throw new ApiError(httpStatus.FORBIDDEN, 'File size exceeds subscription limit');
        }

        const totalFiles = await prisma.file.count({ where: { userId } });
        if (pkg.totalFileLimit && totalFiles >= pkg.totalFileLimit) {
            throw new ApiError(httpStatus.FORBIDDEN, 'File upload limit reached for your current subscription plan');
        }

        const filesInFolder = await prisma.file.count({ where: { folderId } });
        if (pkg.filesPerFolder && filesInFolder >= pkg.filesPerFolder) {
            throw new ApiError(httpStatus.FORBIDDEN, 'Files per folder limit reached for your subscription');
        }
    }

    // Upload to cloud (or keep local) then create record
    const uploaded: any = await fileUploader.uploadToCloudinary(file);

    // Prefer secure_url from Cloudinary, fall back to url
    const fileUrl = uploaded?.secure_url || uploaded?.url || '';

    const data: any = {
        name: file.originalname,
        type,
        sizeMB,
        filePath: fileUrl,
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
    return prisma.file.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            type: true,
            sizeMB: true,
            filePath: true,
            userId: true,
            folderId: true,
            createdAt: true,
            updatedAt: true
        }
    });
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
