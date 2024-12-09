import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../../utils/apiErrors";
import { addedAdminSuccess, adminRoute, alreadyAdmin, issueWithDatabaseString, noRequestBodyString, relogin, userNotFoundString, zodErrorsString } from "../../../../../responseStrings/responseStrings";
import { ApiResponse } from "../../../../../../utils/apiResponse";
import { zodTypes } from "@repo/zod/zodTypes";
import prisma from "@repo/database/client";

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

        const zodCheckedAddAdminType = zodTypes.addAdminType.safeParse(requestBody);
        if (!zodCheckedAddAdminType.success) {
            const zodErrors: string[] = []
            zodCheckedAddAdminType.error.errors.map((err) => {
                zodErrors.push(err.message)
            })
            return NextResponse.json(new ApiError(400, zodErrorsString, [], zodErrors), { status: 400 })
        }
        const userToBeAdded = await prisma.user.findFirst({
            where: {
                username: zodCheckedAddAdminType.data.username
            }
        });
        if (!userToBeAdded) {
            return NextResponse.json(new ApiError(400, userNotFoundString, [], []), { status: 404 })
        }
        if (userToBeAdded.role == "ADMIN") {
            return NextResponse.json(new ApiError(400, alreadyAdmin, [], []), { status: 400 })
        }
        await prisma.user.update({
            where: {
                username: zodCheckedAddAdminType.data.username
            },
            data: {
                role: "ADMIN"
            }
        });
        return NextResponse.json(new ApiResponse(200, addedAdminSuccess, {}), { status: 200 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
    }
}
