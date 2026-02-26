import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { adminSearchAbleFields } from "./admin.constant";
import { IAdminFilterRequest } from "./admin.interface";

const getAllFromDB = async (params: IAdminFilterRequest, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (params.searchTerm) {
        andConditions.push({
            OR: adminSearchAbleFields.map(field => ({
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

    // Only admins
    andConditions.push({ role: 'ADMIN' });

    //console.dir(andConditions, { depth: 'inifinity' })
    const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : { createdAt: 'desc' }
    });

    const total = await prisma.user.count({ where: whereConditions });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};

const getByIdFromDB = async (id: string) => {
    const result = await prisma.user.findUnique({ where: { id } });
    if (!result || result.role !== 'ADMIN') return null;
    return result;
};

const updateIntoDB = async (id: string, data: Partial<any>) => {
    const existing = await prisma.user.findUniqueOrThrow({ where: { id } });
    if (existing.role !== 'ADMIN') throw new Error('User is not an admin');
    const result = await prisma.user.update({ where: { id }, data });
    return result;
};

const deleteFromDB = async (id: string) => {
    const existing = await prisma.user.findUniqueOrThrow({ where: { id } });
    if (existing.role !== 'ADMIN') throw new Error('User is not an admin');
    const result = await prisma.user.delete({ where: { id } });
    return result;
};


const softDeleteFromDB = async (id: string) => {
    // Prisma schema does not have soft-delete fields; perform hard delete for now
    const existing = await prisma.user.findUniqueOrThrow({ where: { id } });
    if (existing.role !== 'ADMIN') throw new Error('User is not an admin');
    const result = await prisma.user.delete({ where: { id } });
    return result;
};


export const AdminService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
};