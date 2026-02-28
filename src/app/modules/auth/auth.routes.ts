
import express from 'express';
import { authLimiter } from '../../middlewares/rateLimiter';
import { AuthController } from './auth.controller';


const router = express.Router();

router.post(
    '/login',
    authLimiter,
    AuthController.loginUser
);

router.post(
    '/refresh-token',
    AuthController.refreshToken
);



router.get(
    '/me',
    AuthController.getMe
);

export const AuthRoutes = router;