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
exports.FolderController = void 0;
const folder_service_1 = require("./folder.service");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { name, parentId } = req.body;
    const result = yield folder_service_1.FolderService.createFolder(user.id, name, parentId);
    res.json(result);
});
const listChildren = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield folder_service_1.FolderService.listFolderChildren(id);
    res.json(result);
});
const listRoot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield folder_service_1.FolderService.getRootFolders(user.id);
    res.json(result);
});
const rename = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name } = req.body;
    const result = yield folder_service_1.FolderService.renameFolder(id, name);
    res.json(result);
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield folder_service_1.FolderService.deleteFolder(id);
    res.json(result);
});
exports.FolderController = {
    create,
    listChildren,
    listRoot,
    rename,
    remove
};
