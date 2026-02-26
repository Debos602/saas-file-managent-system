import { Prisma, Role } from "@prisma/client";
import * as bcrypt from 'bcryptjs';
import { Request } from "express";
import config from "../../../config";
import { fileUploader } from "../../../helpers/fileUploader";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { userSearchAbleFields } from "./user.constant";

const createAdmin = async (req: Request) => {
    const file = req.file;

    // upload ignored for now — User model contains only basic fields
    const hashedPassword: string = await bcrypt.hash(req.body.password, Number(config.salt_round));

    const adminData = {
        email: req.body.admin.email,
        password: hashedPassword,
        name: req.body.admin.name,
        role: 'ADMIN' as Role
    };

    const result = await prisma.user.create({ data: adminData });
    return result;
};

const createDoctor = async (req: Request) => {
    const hashedPassword: string = await bcrypt.hash(req.body.password, Number(config.salt_round));
    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        name: req.body.doctor.name,
        role: 'USER' as Role
    };
    const result = await prisma.user.create({ data: userData });
    return result;
};

const createPatient = async (req: Request) => {
    const hashedPassword: string = await bcrypt.hash(req.body.password, Number(config.salt_round));
    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        name: req.body.patient.name,
        role: 'USER' as Role
    };
    const result = await prisma.user.create({ data: userData });
    return result;
};

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (params.searchTerm) {
        andConditions.push({
            OR: userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    };

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        });
    };

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });

    const total = await prisma.user.count({
        where: whereConditions
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};

const changeProfileStatus = async (id: string, body: any) => {
    // body should contain { role: 'ADMIN' | 'USER' }
    const userData = await prisma.user.findUniqueOrThrow({ where: { id } });
    const updateUser = await prisma.user.update({ where: { id }, data: { role: body.role } });
    return updateUser;
};

const getMyProfile = async (user: IAuthUser) => {
    const userInfo = await prisma.user.findUniqueOrThrow({ where: { email: user?.email }, select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true } });
    return userInfo;
};


const updateMyProfie = async (user: IAuthUser, req: Request) => {
    const userInfo = await prisma.user.findUniqueOrThrow({ where: { email: user?.email } });
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        // no profile photo field on User model; ignore or extend schema
        req.body.profilePhoto = uploadToCloudinary?.secure_url;
    }

    const update = await prisma.user.update({ where: { id: userInfo.id }, data: req.body as any });
    return update;
};


export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfie
};