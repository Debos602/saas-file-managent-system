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
    const userData = await prisma.user.findUniqueOrThrow({ where: { email: payload.email } });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
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

    const userData = await prisma.user.findUniqueOrThrow({ where: { email: decodedData.email } });

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


const getMe = async (user: any) => {
    const accessToken = user.accessToken;
    // If a user object with email is provided, return basic profile; otherwise decode accessToken
    if (user && user.email) {
        const userData = await prisma.user.findUniqueOrThrow({ where: { email: user.email }, select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true } });
        return userData;
    }

    if (accessToken) {
        const decodedData = jwtHelpers.verifyToken(accessToken, config.jwt.jwt_secret as Secret);
        const userData = await prisma.user.findUniqueOrThrow({ where: { email: decodedData.email }, select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true } });
        return userData;
    }

    throw new ApiError(httpStatus.BAD_REQUEST, 'No user information available');
};



export const AuthServices = {
    loginUser,
    refreshToken,
    getMe
};