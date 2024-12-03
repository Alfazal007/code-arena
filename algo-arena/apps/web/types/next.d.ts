import { NextRequest } from 'next/server';

declare module 'next/server' {
    interface NextRequest {
        user?: {
            username: string;
            id: string;
            email: string;
        };
    }
}

