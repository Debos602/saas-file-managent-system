import express from 'express';
import { apiLimiter } from '../middlewares/rateLimiter';
import { userRoutes } from '../modules/user/user.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { PaymentRoutes } from '../modules/payment/payment.routes';
import { MetaRoutes } from '../modules/meta/meta.routes';


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
        path: '/payment',
        route: PaymentRoutes
    },

    {
        path: '/meta',
        route: MetaRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;