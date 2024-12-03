import { NextRequest, NextResponse } from "next/server";
import { envFiles } from "../../../../../../../../../utils/envLoader";
import { ApiError } from "../../../../../../../../../utils/apiErrors";
import prisma from "@repo/database/client";
import { ApiResponse } from "../../../../../../../../../utils/apiResponse";
import { redisClient } from "../../../../../../../../../utils/redis";

export async function GET(request: NextRequest, { params }: { params: Promise<{ secret: string, token: string, username: string, email: string, id: string }> }) {
    try {
        const { secret, email, username, id, token } = await params;
        if (!secret || !username || !email || !id || secret != envFiles.secretUrl || !token) {
            return NextResponse.json(new ApiError(400, "Wrong details", [], []), { status: 400 })
        }
        if (!redisClient.isOpen) {
            await redisClient.connect()
        }
        const tokenFromRedis = await redisClient.get(`auth:${username}`)
        if (tokenFromRedis) {
            if (tokenFromRedis != token) {
                return NextResponse.json(new ApiError(400, "Wrong details", [], []), { status: 400 })
            } else {
                return NextResponse.json(new ApiResponse(200, "Correct details", {}), { status: 200 })
            }
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                AND: [
                    { username },
                    { email },
                    { id }
                ]
            }
        });
        if (!existingUser) {
            return NextResponse.json(new ApiError(400, "Wrong details", [], []), { status: 400 })
        }
        await redisClient.set(`auth:${username}`, token, {
            "EX": 24 * 60 * 60
        });
        return NextResponse.json(new ApiResponse(200, "Correct details", {}), { status: 200 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, "Wrong details", [], []), { status: 400 })
    }
}
