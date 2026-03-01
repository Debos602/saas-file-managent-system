"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("./subscription.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Admin package management
// allow either ADMIN or USER (use single auth call with both roles)
router.get('/packages', (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.USER), subscription_controller_1.SubscriptionController.getAllPackages);
router.post('/packages', (0, auth_1.default)(client_1.Role.ADMIN), subscription_controller_1.SubscriptionController.createPackage);
router.get('/packages/:id', subscription_controller_1.SubscriptionController.getById);
router.put('/packages/:id', (0, auth_1.default)(client_1.Role.ADMIN), subscription_controller_1.SubscriptionController.updatePackage);
router.delete('/packages/:id', (0, auth_1.default)(client_1.Role.ADMIN), subscription_controller_1.SubscriptionController.deletePackage);
// User subscription actions
router.post('/select', (0, auth_1.default)(client_1.Role.USER), subscription_controller_1.SubscriptionController.selectPackage);
router.get('/my', (0, auth_1.default)(client_1.Role.USER), subscription_controller_1.SubscriptionController.getUserSubscriptions);
exports.SubscriptionRoutes = router;
