import express from 'express';
import { FolderController } from './folder.controller';

const router = express.Router();

router.post('/', FolderController.create);
router.get('/root', FolderController.listRoot);
router.get('/:id/children', FolderController.listChildren);
router.patch('/:id', FolderController.rename);
router.delete('/:id', FolderController.remove);

export const FolderRoutes = router;
