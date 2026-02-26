import { Request, Response } from "express";
import { FolderService } from "./folder.service";

const create = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { name, parentId } = req.body;
    const result = await FolderService.createFolder(user.id, name, parentId);
    res.json(result);
};

const listChildren = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FolderService.listFolderChildren(id);
    res.json(result);
};

const listRoot = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await FolderService.getRootFolders(user.id);
    res.json(result);
};

const rename = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name } = req.body;
    const result = await FolderService.renameFolder(id, name);
    res.json(result);
};

const remove = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FolderService.deleteFolder(id);
    res.json(result);
};

export const FolderController = {
    create,
    listChildren,
    listRoot,
    rename,
    remove
};
