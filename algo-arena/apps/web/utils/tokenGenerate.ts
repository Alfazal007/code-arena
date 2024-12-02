import jwt from "jsonwebtoken";
import { envFiles } from "./envLoader";

export function generateAccessToken(user: {
    username: string;
    email: string;
    password: string;
    id: string;
}): string {
    const token = jwt.sign({
        username: user.username,
        email: user.email,
        id: user.id
    }, envFiles.accessTokenSecret, {
        expiresIn: "24h"
    });
    return token;
}

export function generateRefreshToken(user: {
    username: string;
    email: string;
    password: string;
    id: string;
}): string {
    const token = jwt.sign({
        username: user.username,
        email: user.email,
        id: user.id
    }, envFiles.refreshTokenSecret, {
        expiresIn: "7d"
    });
    return token;
}
