"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const bcrypt = __importStar(require("bcryptjs"));
const config_1 = __importDefault(require("../config"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExistSuperAdmin = yield prisma_1.default.user.findFirst({ where: { role: 'ADMIN' } });
        if (isExistSuperAdmin) {
            console.log("Super admin already exists!");
            return;
        }
        ;
        const hashedPassword = yield bcrypt.hash(config_1.default.admin_password, Number(config_1.default.salt_round));
        const superAdminData = yield prisma_1.default.user.create({
            data: {
                email: config_1.default.admin_email,
                password: hashedPassword,
                role: 'ADMIN',
                name: 'Admin'
            }
        });
        console.log("Super Admin Created Successfully!", superAdminData);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        // Ensure default subscription packages exist
        try {
            const packages = [
                {
                    name: 'Free',
                    maxFolders: 5,
                    maxNestingLevel: 2,
                    allowedFileTypes: ['Image', 'PDF'],
                    maxFileSizeMB: 5,
                    totalFileLimit: 20,
                    filesPerFolder: 5
                },
                {
                    name: 'Silver',
                    maxFolders: 50,
                    maxNestingLevel: 3,
                    allowedFileTypes: ['Image', 'PDF', 'Audio'],
                    maxFileSizeMB: 25,
                    totalFileLimit: 500,
                    filesPerFolder: 50
                },
                {
                    name: 'Gold',
                    maxFolders: 200,
                    maxNestingLevel: 5,
                    allowedFileTypes: ['Image', 'Video', 'PDF', 'Audio'],
                    maxFileSizeMB: 100,
                    totalFileLimit: 5000,
                    filesPerFolder: 500
                },
                {
                    name: 'Diamond',
                    maxFolders: 1000,
                    maxNestingLevel: 10,
                    allowedFileTypes: ['Image', 'Video', 'PDF', 'Audio'],
                    maxFileSizeMB: 1024,
                    totalFileLimit: 100000,
                    filesPerFolder: 5000
                }
            ];
            for (const p of packages) {
                const exists = yield prisma_1.default.subscriptionPackage.findUnique({ where: { name: p.name } });
                if (!exists) {
                    yield prisma_1.default.subscriptionPackage.create({ data: p });
                }
            }
        }
        catch (e) {
            console.error('Failed to seed packages', e);
        }
        yield prisma_1.default.$disconnect();
    }
});
exports.default = seedSuperAdmin;
