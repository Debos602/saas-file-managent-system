"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const user_routes_1 = require("../modules/user/user.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const subscription_routes_1 = require("../modules/subscription/subscription.routes");
const folder_routes_1 = require("../modules/storage/folder.routes");
const file_routes_1 = require("../modules/storage/file.routes");
const router = express_1.default.Router();
router.use(rateLimiter_1.apiLimiter); // Apply to all routes
const moduleRoutes = [
    {
        path: '/user',
        route: user_routes_1.userRoutes
    },
    {
        path: '/admin',
        route: admin_routes_1.AdminRoutes
    },
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes
    },
    {
        path: '/subscription',
        route: subscription_routes_1.SubscriptionRoutes
    },
    {
        path: '/folders',
        route: folder_routes_1.FolderRoutes
    },
    {
        path: '/files',
        route: file_routes_1.FileRoutes
    }
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
