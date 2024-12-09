import { envFiles } from "./envLoader";
import { importJWK, SignJWT } from "jose";

export async function generateAccessToken(user: {
    username: string;
    email: string;
    password: string;
    id: string;
    isPremium: boolean;
    role: string;
}): Promise<string> {
    const jwk = await importJWK({ k: envFiles.accessTokenSecret, alg: 'HS256', kty: 'oct' });

    const jwt = await new SignJWT({ username: user.username, id: user.id, email: user.email, isPremium: user.isPremium, role: user.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(jwk);
    return jwt;
}

export async function generateRefreshToken(user: {
    username: string;
    email: string;
    password: string;
    id: string;
    isPremium: boolean;
    role: string;
}): Promise<string> {
    const jwk = await importJWK({ k: envFiles.accessTokenSecret, alg: 'HS256', kty: 'oct' });

    const jwt = await new SignJWT({ username: user.username, id: user.id, email: user.email, isPremium: user.isPremium, role: user.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('10d')
        .sign(jwk);
    return jwt;
}
