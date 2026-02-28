import express from 'express';
import { apiLimiter } from '../middlewares/rateLimiter';
import { userRoutes } from '../modules/user/user.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { MetaRoutes } from '../modules/meta/meta.routes';
import { SubscriptionRoutes } from '../modules/subscription/subscription.routes';
import { FolderRoutes } from '../modules/storage/folder.routes';
import { FileRoutes } from '../modules/storage/file.routes';


const router = express.Router();



router.use(apiLimiter); // Apply to all routes

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/meta',
        route: MetaRoutes
    }
    ,
    {
        path: '/subscription',
        route: SubscriptionRoutes
    },
    {
        path: '/folders',
        route: FolderRoutes
    },
    {
        path: '/files',
        route: FileRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;