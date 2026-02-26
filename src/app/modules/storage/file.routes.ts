import express from 'express';
import { FileController } from './file.controller';
import { fileUploader } from '../../../helpers/fileUploader';

const router = express.Router();

router.post('/', fileUploader.upload.single('file'), FileController.upload);
router.get('/folder/:folderId', FileController.list);
router.get('/:id', FileController.getById);
router.delete('/:id', FileController.remove);
router.patch('/:id', FileController.rename);

export const FileRoutes = router;
