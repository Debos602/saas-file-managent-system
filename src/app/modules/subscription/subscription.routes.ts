import express from 'express';
import { SubscriptionController } from './subscription.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

// Admin package management
// allow either ADMIN or USER (use single auth call with both roles)
router.get('/packages', auth(Role.ADMIN, Role.USER), SubscriptionController.getAllPackages);
router.post('/packages', auth(Role.ADMIN), SubscriptionController.createPackage);
router.get('/packages/:id', SubscriptionController.getById);
router.put('/packages/:id', auth(Role.ADMIN), SubscriptionController.updatePackage);
router.delete('/packages/:id', auth(Role.ADMIN), SubscriptionController.deletePackage);

// User subscription actions
router.post('/select', auth(Role.USER), SubscriptionController.selectPackage);
router.get('/my', auth(Role.USER), SubscriptionController.getUserSubscriptions);

export const SubscriptionRoutes = router;
