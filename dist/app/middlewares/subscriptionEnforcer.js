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
exports.mapMimeToType = exports.getActivePackageForUser = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getActivePackageForUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const active = yield prisma_1.default.userSubscription.findFirst({
        where: {
            userId,
            OR: [
                { endDate: null },
                { endDate: { gt: new Date() } }
            ]
        },
        include: { package: true },
        orderBy: { startDate: 'desc' }
    });
    return (_a = active === null || active === void 0 ? void 0 : active.package) !== null && _a !== void 0 ? _a : null;
});
exports.getActivePackageForUser = getActivePackageForUser;
const mapMimeToType = (originalName, mimeType) => {
    const name = originalName.toLowerCase();
    if (mimeType) {
        if (mimeType.startsWith('image/'))
            return 'Image';
        if (mimeType.startsWith('video/'))
            return 'Video';
        if (mimeType === 'application/pdf')
            return 'PDF';
        if (mimeType.startsWith('audio/'))
            return 'Audio';
    }
    if (name.match(/\.jpe?g|\.png|\.gif|\.bmp|\.webp$/))
        return 'Image';
    if (name.match(/\.mp4|\.mov|\.mkv|\.avi|\.webm$/))
        return 'Video';
    if (name.endsWith('.pdf'))
        return 'PDF';
    if (name.match(/\.mp3|\.wav|\.ogg|\.m4a$/))
        return 'Audio';
    return 'Unknown';
};
exports.mapMimeToType = mapMimeToType;
