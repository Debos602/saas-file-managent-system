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
exports.FolderService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const subscriptionEnforcer_1 = require("../../middlewares/subscriptionEnforcer");
const createFolder = (userId, name, parentId) => __awaiter(void 0, void 0, void 0, function* () {
    const pkg = yield (0, subscriptionEnforcer_1.getActivePackageForUser)(userId);
    const totalFolders = yield prisma_1.default.folder.count({ where: { userId } });
    if (pkg && pkg.maxFolders !== null && totalFolders >= pkg.maxFolders) {
        throw new Error('Max folders limit reached for your subscription');
    }
    let level = 1;
    if (parentId) {
        const parent = yield prisma_1.default.folder.findUniqueOrThrow({ where: { id: parentId } });
        level = parent.level + 1;
    }
    if (pkg && pkg.maxNestingLevel !== null && level > pkg.maxNestingLevel) {
        throw new Error('Max nesting level exceeded for your subscription');
    }
    const folder = yield prisma_1.default.folder.create({ data: { name, userId, parentId: parentId !== null && parentId !== void 0 ? parentId : null, level } });
    return folder;
});
const listFolderChildren = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.folder.findMany({ where: { parentId: id } });
});
const getRootFolders = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.folder.findMany({ where: { userId, parentId: null } });
});
const renameFolder = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.folder.findUniqueOrThrow({ where: { id } });
    return prisma_1.default.folder.update({ where: { id }, data: { name } });
});
const deleteFolder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.folder.findUniqueOrThrow({ where: { id } });
    return prisma_1.default.folder.delete({ where: { id } });
});
exports.FolderService = {
    createFolder,
    listFolderChildren,
    getRootFolders,
    renameFolder,
    deleteFolder
};
