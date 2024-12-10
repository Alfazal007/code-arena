import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../../../utils/apiErrors";
import { issueWithDatabaseString, relogin } from "../../../../../../responseStrings/responseStrings";
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
        const redisData = await redisClient.zRangeWithScores(contestId, 0, 49, {
            REV: true,
        });
        let data: { leaderBoardId: string, points: number, rank: number }[] = [];
        for (let i = 0; i < redisData.length; i++) {
            data.push({
                points: redisData[i]?.score as number,
                leaderBoardId: redisData[i]?.value as string,
                rank: i + 1
            })
        }
        if (redisData.length > 0) {
            return NextResponse.json(new ApiResponse(200, "", data), { status: 200 })
        }
        let leaderBoardData = await prisma.leaderBoard.findMany({
            where: {
                contestId: contestId
            },
            orderBy: {
                rank: "asc"
            },
        });
        data = [];
        for (let i = 0; i < leaderBoardData.length; i++) {
            data.push({
                points: leaderBoardData[i]?.points as number,
                leaderBoardId: leaderBoardData[i]?.id as string,
                rank: leaderBoardData[i]?.rank as number
            })
        }
        return NextResponse.json(new ApiResponse(200, "", data), { status: 200 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
    }
}
