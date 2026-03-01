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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const createPackage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.subscriptionPackage.create({
        data: payload
    });
    return result;
});
const updatePackage = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.subscriptionPackage.findUniqueOrThrow({ where: { id } });
    return prisma_1.default.subscriptionPackage.update({ where: { id }, data });
});
const deletePackage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.subscriptionPackage.findUniqueOrThrow({ where: { id } });
    return prisma_1.default.subscriptionPackage.delete({ where: { id } });
});
const getAllPackages = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.subscriptionPackage.findMany({ orderBy: { createdAt: 'asc' } });
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.subscriptionPackage.findUnique({ where: { id } });
});
const selectPackageForUser = (userId, packageId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new ApiError_1.default(401, 'User authentication required');
    }
    if (!packageId) {
        throw new ApiError_1.default(400, 'packageId is required');
    }
    // End previous active subscription
    yield prisma_1.default.userSubscription.updateMany({
        where: { userId, endDate: null },
        data: { endDate: new Date() }
    });
    const subscription = yield prisma_1.default.userSubscription.create({
        data: { userId, packageId }
    });
    return subscription;
});
const getUserSubscriptions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.userSubscription.findMany({ where: { userId }, include: { package: true } });
});
exports.SubscriptionService = {
    createPackage,
    updatePackage,
    deletePackage,
    getAllPackages,
    getById,
    selectPackageForUser,
    getUserSubscriptions
};
