import { Request, Response } from 'express';
import { FileService } from './file.service';
import { FolderService } from './folder.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const upload = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    let folderId = req.body.folderId as string | undefined;
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
        sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: 'No file uploaded'
        });
        return;
    }

    if (!folderId) {
        const roots = await FolderService.getRootFolders(user.id);
        if (roots && roots.length > 0) folderId = roots[0].id;
        else {
            const created = await FolderService.createFolder(user.id, 'root');
            folderId = created.id;
        }
    }

    const result = await FileService.uploadFile(user.id, folderId, file);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'File uploaded',
        data: result
    });
});

const list = catchAsync(async (req: Request, res: Response) => {
    const folderId = req.params.folderId;
    const result = await FileService.listFilesInFolder(folderId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Files fetched',
        data: result
    });
});

const getById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FileService.getFileById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'File fetched',
        data: result
    });
});

const remove = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FileService.deleteFile(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'File deleted',
        data: result
    });
});

const rename = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name } = req.body;
    const result = await FileService.renameFile(id, name);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'File renamed',
        data: result
    });
});

export const FileController = {
    upload,
    list,
    getById,
    remove,
    rename
};
