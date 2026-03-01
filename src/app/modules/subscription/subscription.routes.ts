import express from 'express';
import { SubscriptionController } from './subscription.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

// Admin package management
router.get('/packages', SubscriptionController.getAllPackages);
router.post('/packages', SubscriptionController.createPackage);
router.get('/packages/:id', SubscriptionController.getById);
router.put('/packages/:id', auth(Role.ADMIN), SubscriptionController.updatePackage);
router.delete('/packages/:id', auth(Role.ADMIN), SubscriptionController.deletePackage);

// User subscription actions
router.post('/select', auth(Role.USER), SubscriptionController.selectPackage);
router.get('/my', SubscriptionController.getUserSubscriptions);

export const SubscriptionRoutes = router;
