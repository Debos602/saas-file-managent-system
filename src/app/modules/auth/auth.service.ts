import { Role } from "@prisma/client";
import * as bcrypt from 'bcryptjs';
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";

const loginUser = async (payload: {
    email: string,
    password: string;
}) => {
    const userData = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!userData) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }
    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        id: userData.id
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        id: userData.id
    },
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as string
    );

    return { accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
    }
    catch (err) {
        throw new Error("You are not authorized!");
    }

    const userData = await prisma.user.findUnique({ where: { email: decodedData.email } });
    if (!userData) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        id: userData.id
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        id: userData.id
    },
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as string
    );

    return { accessToken, refreshToken };

};


const getMe = async (accessToken: string | undefined) => {
    if (!accessToken) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const decodedData = jwtHelpers.verifyToken(
        accessToken,
        config.jwt.jwt_secret as Secret
    );

    const userData = await prisma.user.findUnique({
        where: { email: decodedData.email },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!userData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return userData;
};



export const AuthServices = {
    loginUser,
    refreshToken,
    getMe
};