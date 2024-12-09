import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../../../../utils/apiErrors";
import { ApiResponse } from "../../../../../../../../utils/apiResponse";
import { issueWithDatabaseString, relogin } from "../../../../../../../responseStrings/responseStrings";
import prisma from "@repo/database/client";

export async function GET(request: NextRequest, { params }: { params: Promise<{ offset: string, limit: string }> }) {
    const userHeader = request.headers.get('x-user');
    const currentUser = userHeader ? JSON.parse(userHeader) : null;
    if (!currentUser) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    try {
        const { offset, limit } = await params;
        let skip = 0, size = 10;
        try {
            skip = parseInt(offset);
            size = parseInt(limit);
        } catch (err) { }
        const problems = await prisma.problems.findMany({
            skip,
            take: size,
            select: {
                id: true,
                name: true,
            }
        });
        return NextResponse.json(new ApiResponse(200, "", problems), { status: 200 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 401 })
    }
}
