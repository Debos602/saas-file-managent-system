"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const folder_controller_1 = require("./folder.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(client_1.Role.USER), folder_controller_1.FolderController.create);
router.get('/root', (0, auth_1.default)(client_1.Role.USER), folder_controller_1.FolderController.listRoot);
router.get('/:id/children', folder_controller_1.FolderController.listChildren);
router.patch('/:id', (0, auth_1.default)(client_1.Role.USER), folder_controller_1.FolderController.rename);
router.delete('/:id', (0, auth_1.default)(client_1.Role.USER), folder_controller_1.FolderController.remove);
exports.FolderRoutes = router;
