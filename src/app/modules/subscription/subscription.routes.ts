import express from 'express';
import { SubscriptionController } from './subscription.controller';

const router = express.Router();

// Admin package management
router.get('/packages', SubscriptionController.getAllPackages);
router.post('/packages', SubscriptionController.createPackage);
router.get('/packages/:id', SubscriptionController.getById);
router.put('/packages/:id', SubscriptionController.updatePackage);
router.delete('/packages/:id', SubscriptionController.deletePackage);

// User subscription actions
router.post('/select', SubscriptionController.selectPackage);
router.get('/my', SubscriptionController.getUserSubscriptions);

export const SubscriptionRoutes = router;
