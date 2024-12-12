import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "../../../../../../../utils/apiResponse";
import prisma from "@repo/database/client";
import { ApiError } from "../../../../../../../utils/apiErrors";
import { issueWithDatabaseString, problemNotFoundString, relogin } from "../../../../../../responseStrings/responseStrings";

export async function GET(request: NextRequest, { params }: { params: Promise<{ submissionId: string }> }) {
    const userHeader = request.headers.get('x-user');
    const currentUser = userHeader ? JSON.parse(userHeader) : null;
    if (!currentUser) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    try {
        const { submissionId } = await params;
        const submission = await prisma.userProblem.findFirst({
            where: {
                id: submissionId
            },
            select: {
                id: true,
                createdAt: true,
                isCompleted: true,
                errorMessage: true,
                completedTestCases: true
            }
        });
        if (submission) {
            return NextResponse.json(new ApiResponse(200, "", submission), { status: 200 })
        } else {
            return NextResponse.json(new ApiError(404, problemNotFoundString, [], []), { status: 404 })
        }
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 401 })
    }
}
