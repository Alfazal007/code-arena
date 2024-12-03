import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { envFiles } from './utils/envLoader'
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from './utils/apiErrors';
import { relogin } from './app/responseStrings/responseStrings';

export function middleware(request: NextRequest) {
    const token = request.headers.get("authorization")
    if (!token || !token.startsWith("Bearer ")) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    let decodedValue = verifyJWT(token.replace("Bearer ", ""))
    if (!decodedValue || !decodedValue.username || !decodedValue.id || !decodedValue.email) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    request.user = { username: decodedValue.username, email: decodedValue.email, id: decodedValue.id };
    return NextResponse.next()
}

export const config = {
    matcher: '/api/auth/:path*',
}


export function verifyJWT(token: string): null | JwtPayload {
    const accessSecret = envFiles.accessTokenSecret;
    try {
        const decodedValue = jwt.verify(token, accessSecret)
        return decodedValue as JwtPayload
    } catch (err) {
        return null
    }
}
