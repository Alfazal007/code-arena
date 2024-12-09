import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../../utils/apiErrors";
import { contestNotFound, issueWithDatabaseString, relogin } from "../../../../../responseStrings/responseStrings";
import { ApiResponse } from "../../../../../../utils/apiResponse";
import prisma from "@repo/database/client";

export async function GET(request: NextRequest) {
    const userHeader = request.headers.get('x-user');
    const currentUser = userHeader ? JSON.parse(userHeader) : null;
    if (!currentUser) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    try {
        const contests = await prisma.contest.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 30
        });
        if (!contests) {
            return NextResponse.json(new ApiError(400, contestNotFound, [], []), { status: 404 })
        }
        return NextResponse.json(new ApiResponse(200, "", contests), { status: 200 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
    }
}

