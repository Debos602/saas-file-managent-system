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
exports.MetaService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fetchDashboardMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    const userCount = yield prisma_1.default.user.count();
    const packageCount = yield prisma_1.default.subscriptionPackage.count();
    const fileCount = yield prisma_1.default.file.count();
    const folderCount = yield prisma_1.default.folder.count();
    const subscriptionCount = yield prisma_1.default.userSubscription.count();
    return {
        userCount,
        packageCount,
        fileCount,
        folderCount,
        subscriptionCount
    };
});
exports.MetaService = { fetchDashboardMetaData };
