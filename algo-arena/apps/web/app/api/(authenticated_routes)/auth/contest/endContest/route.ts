import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../../utils/apiErrors";
import { adminRoute, contestFinish, contestNotFound, contestNotStartedYet, contestOver, contestStarted, contestStartedAlready, createdContestSuccess, issueWithDatabaseString, noRequestBodyString, problemNotFoundString, relogin, zodErrorsString } from "../../../../../responseStrings/responseStrings";
import { ApiResponse } from "../../../../../../utils/apiResponse";
import { zodTypes } from "@repo/zod/zodTypes";
import prisma from "@repo/database/client";
import { redisClient } from "../../../../../../utils/redis";

export async function POST(request: NextRequest) {
    const userHeader = request.headers.get('x-user');
    const currentUser = userHeader ? JSON.parse(userHeader) : null;
    if (!currentUser) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    if (currentUser.role != "ADMIN") {
        return NextResponse.json(new ApiError(401, adminRoute, [], []), { status: 401 })
    }
    try {
        let requestBody;
        try {
            requestBody = await request.json();
        } catch (err) {
            return NextResponse.json(new ApiError(400, noRequestBodyString, [], []), { status: 400 })
        }
        const zodStartContestType = zodTypes.endContestType.safeParse(requestBody);
        if (!zodStartContestType.success) {
            const zodErrors: string[] = []
            zodStartContestType.error.errors.map((err) => {
                zodErrors.push(err.message)
            })
            return NextResponse.json(new ApiError(400, zodErrorsString, [], zodErrors), { status: 400 })
        }
        const contestRequired = await prisma.contest.findFirst({
            where: {
                id: zodStartContestType.data.contestId
            }
        });
        if (!contestRequired) {
            return NextResponse.json(new ApiError(404, contestNotFound, [], []), { status: 404 })
        }
        if (contestRequired.started == false) {
            return NextResponse.json(new ApiError(400, contestNotStartedYet, [], []), { status: 400 })
        }
        if (contestRequired.completed == true) {
            return NextResponse.json(new ApiError(400, contestOver, [], []), { status: 400 })
        }
        await prisma.contest.update({
            where: {
                id: contestRequired.id
            },
            data: {
                completed: true
            }
        });
        if (!redisClient.isOpen) {
            await redisClient.connect()
        }
        const valuesWithScores = await redisClient.zRangeWithScores(`${contestRequired.id}`, 0, -1, { REV: true });
        for (let i = 0; i < valuesWithScores.length; i++) {
            await prisma.leaderBoard.update({
                where: {
                    id: valuesWithScores[i]?.value
                },
                data: {
                    rank: i + 1,
                    points: valuesWithScores[i]?.score
                }
            });
        }
        await redisClient.del(`${contestRequired.id}`);
        return NextResponse.json(new ApiResponse(200, contestFinish, {}), { status: 200 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
    }
}
