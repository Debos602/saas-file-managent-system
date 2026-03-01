"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const file_controller_1 = require("./file.controller");
const fileUploader_1 = require("../../../helpers/fileUploader");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(client_1.Role.USER), fileUploader_1.fileUploader.upload.single('file'), file_controller_1.FileController.upload);
router.get('/folder/:folderId', file_controller_1.FileController.list);
router.get('/:id', file_controller_1.FileController.getById);
router.delete('/:id', file_controller_1.FileController.remove);
router.patch('/:id', file_controller_1.FileController.rename);
exports.FileRoutes = router;
