import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import ApiError from "../errors/ApiError";
import prisma from "../../shared/prisma";


const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any; }, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization as string | undefined;
            let token = authHeader || req.cookies?.accessToken;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
            console.log({ token }, "from auth guard");

            if (!token) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
            }

            let verifiedUser = jwtHelpers.verifyToken(token, config.jwt.jwt_secret as Secret) as any;

            // If the token doesn't include `id`, attempt to resolve it from DB using email
            if (!verifiedUser.id && verifiedUser.email) {
                const dbUser = await prisma.user.findUnique({ where: { email: verifiedUser.email }, select: { id: true, email: true, role: true } });
                if (!dbUser) {
                    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
                }
                verifiedUser = { ...verifiedUser, id: dbUser.id };
            }

            req.user = verifiedUser;

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};

export default auth;