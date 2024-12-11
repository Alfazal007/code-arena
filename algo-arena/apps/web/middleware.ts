import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { envFiles } from './utils/envLoader'
import { ApiError } from './utils/apiErrors';
import { relogin } from './app/responseStrings/responseStrings';
import { importJWK, jwtVerify } from 'jose';

const ALLOWED_ORIGIN = 'http://localhost:5173';
const ALLOWED_METHODS = 'GET,POST,PUT,DELETE,OPTIONS';
const ALLOWED_HEADERS = 'Content-Type,Authorization';

export async function middleware(request: NextRequest) {
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
                'Access-Control-Allow-Methods': ALLOWED_METHODS,
                'Access-Control-Allow-Headers': ALLOWED_HEADERS,
                'Access-Control-Allow-Credentials': 'true',
            }
        });
    }

    const corsHeaders = {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': ALLOWED_METHODS,
        'Access-Control-Allow-Headers': ALLOWED_HEADERS,
        'Access-Control-Allow-Credentials': 'true',
    };

    const token = request.headers.get("authorization")
    if (!token || !token.startsWith("Bearer ")) {
        return NextResponse.json(
            new ApiError(401, relogin, [], []),
            {
                status: 401,
                headers: corsHeaders
            }
        )
    }

    let decodedValue = await verifyJWT(token.replace("Bearer ", ""))
    if (!decodedValue) {
        return NextResponse.json(
            new ApiError(401, relogin, [], []),
            {
                status: 401,
                headers: corsHeaders
            }
        )
    }

    try {
        const responseChecker = await fetch(`http://localhost:3000/api/checkUserExists/${decodedValue.username}/${decodedValue.email}/${decodedValue.id}/${envFiles.secretUrl}/${token.replace("Bearer ", "")}`)
        if (!responseChecker.ok || responseChecker.status != 200) {
            return NextResponse.json(
                new ApiError(401, relogin, [], []),
                {
                    status: 401,
                    headers: corsHeaders
                }
            )
        }
    } catch (err) {
        return NextResponse.json(
            new ApiError(401, relogin, [], []),
            {
                status: 401,
                headers: corsHeaders
            }
        )
    }

    const res = NextResponse.next();

    // Add CORS headers to the response
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.headers.set(key, value);
    });

    // Set user headers
    let headerValues = {
        username: decodedValue.username,
        email: decodedValue.email,
        id: decodedValue.id,
        isPremium: decodedValue.isPremium,
        role: decodedValue.role
    };
    res.headers.set('x-user', JSON.stringify(headerValues));

    return res;
}

export const config = {
    matcher: '/api/auth/:path*',
    runtime: 'nodejs'
}

export async function verifyJWT(token: string): Promise<null | { username: string, email: string, id: string, isPremium: boolean, role: string }> {
    const secret = envFiles.accessTokenSecret
    try {
        const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });
        const { payload } = await jwtVerify(token, jwk);
        return {
            username: payload.username as string,
            email: payload.email as string,
            id: payload.id as string,
            isPremium: payload.isPremium as boolean,
            role: payload.role as string
        };
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}
