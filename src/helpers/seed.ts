import { Role } from "@prisma/client";
import * as bcrypt from 'bcryptjs';
import config from "../config";
import prisma from "../shared/prisma";

const seedSuperAdmin = async () => {
    try {
        const isExistSuperAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

        if (isExistSuperAdmin) {
            console.log("Super admin already exists!");
            return;
        };

        const hashedPassword = await bcrypt.hash("123456", Number(config.salt_round));

        const superAdminData = await prisma.user.create({
            data: {
                email: "admin@gmail.com",
                password: hashedPassword,
                role: 'ADMIN' as Role,
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
                const exists = await prisma.subscriptionPackage.findUnique({ where: { name: p.name } });
                if (!exists) {
                    await prisma.subscriptionPackage.create({ data: p as any });
                }
            }
        }
        catch (e) {
            console.error('Failed to seed packages', e);
        }

        await prisma.$disconnect();
    }
};

export default seedSuperAdmin;