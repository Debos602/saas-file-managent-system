import express from 'express';
import { FolderController } from './folder.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/', auth(Role.USER), FolderController.create);
router.get('/root', auth(Role.USER), FolderController.listRoot);
router.get('/:id/children', FolderController.listChildren);
router.patch('/:id', auth(Role.USER), FolderController.rename);
router.delete('/:id', auth(Role.USER), FolderController.remove);

export const FolderRoutes = router;
