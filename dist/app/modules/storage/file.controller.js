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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const file_service_1 = require("./file.service");
const folder_service_1 = require("./folder.service");
const upload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let folderId = req.body.folderId;
    const file = req.file;
    if (!file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    // Ensure a folder is available: use provided, or user's first root folder, or create one
    if (!folderId) {
        const roots = yield folder_service_1.FolderService.getRootFolders(user.id);
        if (roots && roots.length > 0) {
            folderId = roots[0].id;
        }
        else {
            const created = yield folder_service_1.FolderService.createFolder(user.id, 'root');
            folderId = created.id;
        }
    }
    const result = yield file_service_1.FileService.uploadFile(user.id, folderId, file);
    res.json(result);
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const folderId = req.params.folderId;
    const result = yield file_service_1.FileService.listFilesInFolder(folderId);
    res.json(result);
});
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield file_service_1.FileService.getFileById(id);
    res.json(result);
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield file_service_1.FileService.deleteFile(id);
    res.json(result);
});
const rename = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name } = req.body;
    const result = yield file_service_1.FileService.renameFile(id, name);
    res.json(result);
});
exports.FileController = {
    upload,
    list,
    getById,
    remove,
    rename
};
