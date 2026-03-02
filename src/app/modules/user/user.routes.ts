import { Role } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import { fileUploader } from '../../../helpers/fileUploader';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { userController } from './user.controller';
import { userValidation } from './user.validation';

const router = express.Router();

router.get('/', auth(Role.ADMIN), userController.getAllFromDB);

router.get('/me', auth(Role.ADMIN, Role.USER), userController.getMyProfile);

router.post(
    "/create-user",
    fileUploader.upload.single('file'),
    userController.createUser
);



router.patch(
    '/:id/status',
    auth(Role.ADMIN),
    validateRequest(userValidation.updateStatus),
    userController.changeProfileStatus
);

router.delete('/:id', auth(Role.ADMIN), userController.deleteUser);

router.patch(
    "/update-my-profile",
    auth(Role.ADMIN, Role.USER),
    fileUploader.upload.single('file'),
    userController.updateMyProfie
);


export const userRoutes = router;