import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../../utils/apiErrors";
import { adminRoute, contestNotFound, contestStarted, contestStartedAlready, createdContestSuccess, issueWithDatabaseString, noRequestBodyString, problemNotFoundString, relogin, zodErrorsString } from "../../../../../responseStrings/responseStrings";
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
        const zodStartContestType = zodTypes.startContestType.safeParse(requestBody);
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
        if (contestRequired.started == true) {
            return NextResponse.json(new ApiError(400, contestStartedAlready, [], []), { status: 404 })
        }

        if (!redisClient.isOpen) {
            await redisClient.connect()
        }
        const startTime = new Date().toISOString();
        await redisClient.set(`contest:${contestRequired.id}:startTime`, startTime);
        await prisma.contest.update({
            where: {
                id: zodStartContestType.data.contestId
            },
            data: {
                started: true,
                completed: false
            }
        });
        return NextResponse.json(new ApiResponse(200, contestStarted, {}), { status: 200 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
    }
}
