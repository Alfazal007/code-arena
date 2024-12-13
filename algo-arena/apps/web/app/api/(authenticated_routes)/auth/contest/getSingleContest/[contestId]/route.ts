import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../../../utils/apiErrors";
import { contestNotFound, issueWithDatabaseString, relogin } from "../../../../../../responseStrings/responseStrings";
import { ApiResponse } from "../../../../../../../utils/apiResponse";
import prisma from "@repo/database/client";

export async function GET(request: NextRequest, { params }: { params: Promise<{ contestId: string }> }) {
    const userHeader = request.headers.get('x-user');
    const currentUser = userHeader ? JSON.parse(userHeader) : null;
    if (!currentUser) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    const { contestId } = await params;
    try {
        const contest = await prisma.contest.findFirst({
            where: {
                id: contestId
            },
            select: {
                problemId: true,
                id: true,
                started: true,
                completed: true,
                Problems: {
                    select: {
                        id: true,
                        name: true,
                        testCases: true,
                        problemDescription: true,
                        halfCodeRust: true,
                        halfCodeJS: true,
                    }
                }
            }
        });
        if (!contest) {
            return NextResponse.json(new ApiError(400, contestNotFound, [], []), { status: 404 })
        }
        return NextResponse.json(new ApiResponse(200, "", contest), { status: 200 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
    }
}
