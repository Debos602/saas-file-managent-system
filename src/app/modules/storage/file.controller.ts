import { Request, Response } from "express";
import { FileService } from './file.service';

const upload = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const folderId = req.body.folderId;
    const file = req.file as Express.Multer.File;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await FileService.uploadFile(user.id, folderId, file);
    res.json(result);
};

const list = async (req: Request, res: Response) => {
    const folderId = req.params.folderId;
    const result = await FileService.listFilesInFolder(folderId);
    res.json(result);
};

const getById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FileService.getFileById(id);
    res.json(result);
};

const remove = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FileService.deleteFile(id);
    res.json(result);
};

const rename = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name } = req.body;
    const result = await FileService.renameFile(id, name);
    res.json(result);
};

export const FileController = {
    upload,
    list,
    getById,
    remove,
    rename
};
