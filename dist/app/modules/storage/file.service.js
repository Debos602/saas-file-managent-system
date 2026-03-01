"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const subscriptionEnforcer_1 = require("../../middlewares/subscriptionEnforcer");
const fileUploader_1 = require("../../../helpers/fileUploader");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const uploadFile = (userId, folderId, file) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pkg = yield (0, subscriptionEnforcer_1.getActivePackageForUser)(userId);
    // Determine type and size
    const type = (0, subscriptionEnforcer_1.mapMimeToType)(file.originalname, file.mimetype);
    const sizeMB = Number((file.size / (1024 * 1024)).toFixed(2));
    if (pkg) {
        if (pkg.allowedFileTypes && pkg.allowedFileTypes.length > 0) {
            const normalizedAllowed = pkg.allowedFileTypes.map((t) => t.toLowerCase().trim());
            const typeLower = (type || '').toLowerCase();
            const mimeLower = (file.mimetype || '').toLowerCase();
            const ext = ((_a = (file.originalname || '').split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
            const allowed = normalizedAllowed.includes(typeLower)
                || normalizedAllowed.includes(mimeLower)
                || normalizedAllowed.some((a) => mimeLower.startsWith(a + '/'))
                || (ext && normalizedAllowed.includes(ext));
            if (!allowed) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'File type not allowed in your subscription');
            }
        }
        if (pkg.maxFileSizeMB && sizeMB > pkg.maxFileSizeMB) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'File size exceeds subscription limit');
        }
        const totalFiles = yield prisma_1.default.file.count({ where: { userId } });
        if (pkg.totalFileLimit && totalFiles >= pkg.totalFileLimit) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'File upload limit reached for your current subscription plan');
        }
        const filesInFolder = yield prisma_1.default.file.count({ where: { folderId } });
        if (pkg.filesPerFolder && filesInFolder >= pkg.filesPerFolder) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Files per folder limit reached for your subscription');
        }
    }
    // Upload to cloud (or keep local) then create record
    const uploaded = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
    // Prefer secure_url from Cloudinary, fall back to url
    const fileUrl = (uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url) || (uploaded === null || uploaded === void 0 ? void 0 : uploaded.url) || '';
    const data = Object.assign({ name: file.originalname, type,
        sizeMB, filePath: fileUrl, user: { connect: { id: userId } } }, (folderId ? { folder: { connect: { id: folderId } } } : {}));
    const record = yield prisma_1.default.file.create({ data });
    return { record, uploaded };
});
const listFilesInFolder = (folderId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.file.findMany({ where: { folderId }, orderBy: { createdAt: 'desc' } });
});
const getFileById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.file.findUnique({
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
});
const deleteFile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.file.findUniqueOrThrow({ where: { id } });
    return prisma_1.default.file.delete({ where: { id } });
});
const renameFile = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.file.findUniqueOrThrow({ where: { id } });
    return prisma_1.default.file.update({ where: { id }, data: { name } });
});
exports.FileService = {
    uploadFile,
    listFilesInFolder,
    getFileById,
    deleteFile,
    renameFile
};
