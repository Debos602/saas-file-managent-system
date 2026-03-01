import { Request, Response } from 'express';
import { FolderService } from './folder.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const create = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { name, parentId } = req.body;
    const result = await FolderService.createFolder(user.id, name, parentId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Folder created',
        data: result
    });
});

const listChildren = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FolderService.listFolderChildren(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Folder children fetched',
        data: result
    });
});

const listRoot = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await FolderService.getRootFolders(user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Root folders fetched',
        data: result
    });
});

const rename = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name } = req.body;
    const result = await FolderService.renameFolder(id, name);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Folder renamed',
        data: result
    });
});

const remove = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FolderService.deleteFolder(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Folder deleted',
        data: result
    });
});

export const FolderController = {
    create,
    listChildren,
    listRoot,
    rename,
    remove
};
