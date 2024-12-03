import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { envFiles } from './utils/envLoader'
import { ApiError } from './utils/apiErrors';
import { relogin } from './app/responseStrings/responseStrings';
import { importJWK, jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.headers.get("authorization")
    if (!token || !token.startsWith("Bearer ")) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    let decodedValue = await verifyJWT(token.replace("Bearer ", ""))
    if (!decodedValue) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }

    try {
        const responseChecker = await fetch(`http://localhost:3000/api/checkUserExists/${decodedValue.username}/${decodedValue.email}/${decodedValue.id}/${envFiles.secretUrl}/${token.replace("Bearer ", "")}`)
        if (!responseChecker.ok || responseChecker.status != 200) {
            return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
        }
    } catch (err) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    const res = NextResponse.next();
    let headerValues = { username: decodedValue.username, email: decodedValue.email, id: decodedValue.id };
    res.headers.set('x-user', JSON.stringify(headerValues));
    return res;
}

export const config = {
    matcher: '/api/auth/:path*',
    runtime: 'nodejs'
}

export async function verifyJWT(token: string): Promise<null | { username: string, email: string, id: string }> {
    const secret = envFiles.accessTokenSecret
    try {
        const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });
        const { payload } = await jwtVerify(token, jwk);
        return { username: payload.username as string, email: payload.email as string, id: payload.id as string };
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}
