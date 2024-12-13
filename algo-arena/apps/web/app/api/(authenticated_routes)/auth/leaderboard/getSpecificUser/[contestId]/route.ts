import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../../../utils/apiErrors";
import { contestNotFound, issueWithDatabaseString, relogin } from "../../../../../../responseStrings/responseStrings";
import { ApiResponse } from "../../../../../../../utils/apiResponse";
import prisma from "@repo/database/client";
import { redisClient } from "../../../../../../../utils/redis";

export async function GET(request: NextRequest, { params }: { params: Promise<{ contestId: string }> }) {
    const userHeader = request.headers.get('x-user');
    const currentUser = userHeader ? JSON.parse(userHeader) : null;
    if (!currentUser) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    try {
        const { contestId } = await params;
        if (!redisClient.isOpen) {
            await redisClient.connect()
        }
        const leaderBoardDB = await prisma.leaderBoard.findFirst({
            where: {
                contestId,
                userId: currentUser.id
            },
            select: {
                id: true,
                rank: true,
                points: true,
                contestId: true
            }
        })
        if (!leaderBoardDB) {
            return NextResponse.json(new ApiError(404, contestNotFound, [], []), { status: 404 });
        }
        if (leaderBoardDB.rank > 0) {
            return NextResponse.json(new ApiResponse(200, "", leaderBoardDB), { status: 200 })
        }
        const redisScore = await redisClient.zScore(contestId, leaderBoardDB.id);
        if (!redisScore) {
            return NextResponse.json(new ApiError(404, contestNotFound, [], []), { status: 404 })
        }
        return NextResponse.json(new ApiResponse(200, "", {
            points: redisScore,
            id: "123",
            contestId: contestId,
            rank: 0
        }), { status: 200 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
    }
}
