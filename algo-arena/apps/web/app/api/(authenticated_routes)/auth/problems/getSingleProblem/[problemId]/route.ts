import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "../../../../../../../utils/apiResponse";
import prisma from "@repo/database/client";
import { ApiError } from "../../../../../../../utils/apiErrors";
import { issueWithDatabaseString, problemNotFoundString, relogin } from "../../../../../../responseStrings/responseStrings";

export async function GET(request: NextRequest, { params }: { params: Promise<{ problemId: string }> }) {
    const userHeader = request.headers.get('x-user');
    const currentUser = userHeader ? JSON.parse(userHeader) : null;
    if (!currentUser) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    try {
        const { problemId } = await params;
        const problem = await prisma.problems.findFirst({
            where: {
                id: problemId
            },
            select: {
                id: true,
                name: true,
                halfCodeRust: true,
                halfCodeJS: true,
                testCases: true,
                userProblem: {
                    select: {
                        id: true,
                        createdAt: true,
                        isCompleted: true,
                        completedTestCases: true,
                        errorMessage: true,
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 10
                }
            }
        });
        if (problem) {
            return NextResponse.json(new ApiResponse(200, "", problem), { status: 200 })
        } else {
            return NextResponse.json(new ApiError(404, problemNotFoundString, [], []), { status: 404 })
        }
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 401 })
    }
}
