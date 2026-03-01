"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const admin_constant_1 = require("./admin.constant");
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: admin_constant_1.adminSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    ;
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    ;
    // Only admins
    andConditions.push({ role: 'ADMIN' });
    //console.dir(andConditions, { depth: 'inifinity' })
    const whereConditions = { AND: andConditions };
    const result = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : { createdAt: 'desc' }
    });
    const total = yield prisma_1.default.user.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({ where: { id } });
    if (!result || result.role !== 'ADMIN')
        return null;
    return result;
});
const updateIntoDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.user.findUniqueOrThrow({ where: { id } });
    if (existing.role !== 'ADMIN')
        throw new Error('User is not an admin');
    const result = yield prisma_1.default.user.update({ where: { id }, data });
    return result;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.user.findUniqueOrThrow({ where: { id } });
    if (existing.role !== 'ADMIN')
        throw new Error('User is not an admin');
    const result = yield prisma_1.default.user.delete({ where: { id } });
    return result;
});
const softDeleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Prisma schema does not have soft-delete fields; perform hard delete for now
    const existing = yield prisma_1.default.user.findUniqueOrThrow({ where: { id } });
    if (existing.role !== 'ADMIN')
        throw new Error('User is not an admin');
    const result = yield prisma_1.default.user.delete({ where: { id } });
    return result;
});
exports.AdminService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
};
