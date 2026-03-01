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
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const authHeader = req.headers.authorization;
            let token = authHeader || ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken);
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
            console.log({ token }, "from auth guard");
            if (!token) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
            }
            let verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.jwt_secret);
            // If the token doesn't include `id`, attempt to resolve it from DB using email
            if (!verifiedUser.id && verifiedUser.email) {
                const dbUser = yield prisma_1.default.user.findUnique({ where: { email: verifiedUser.email }, select: { id: true, email: true, role: true } });
                if (!dbUser) {
                    throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
                }
                verifiedUser = Object.assign(Object.assign({}, verifiedUser), { id: dbUser.id });
            }
            req.user = verifiedUser;
            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden!");
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
};
exports.default = auth;
