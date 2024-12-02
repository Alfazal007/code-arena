import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utils/apiErrors";
import { invalidPassword, issueWithDatabaseString, loginSuccess, noRequestBodyString, userNotFoundString, zodErrorsString } from "../../../responseStrings/responseStrings";
import { zodTypes } from "@repo/zod/zodTypes";
import prisma from "@repo/database/client";
import { compareHashPassword } from "../../../../utils/hashPassword";
import { ApiResponse } from "../../../../utils/apiResponse";
import { generateAccessToken, generateRefreshToken } from "../../../../utils/tokenGenerate";

export async function POST(request: NextRequest) {
    try {
        let requestBody;
        try {
            requestBody = await request.json();
        } catch (err) {
            return NextResponse.json(new ApiError(400, noRequestBodyString, [], []), { status: 400 })
        }

        const zodCheckedLoginType = zodTypes.signinType.safeParse(requestBody);
        if (!zodCheckedLoginType.success) {
            const zodErrors: string[] = []
            zodCheckedLoginType.error.errors.map((err) => {
                zodErrors.push(err.message)
            })
            return NextResponse.json(new ApiError(400, zodErrorsString, [], zodErrors), { status: 400 })
        }

        const existingUserFromDB = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: zodCheckedLoginType.data.username },
                    { email: zodCheckedLoginType.data.username },
                ]
            }
        });

        if (!existingUserFromDB) {
            return NextResponse.json(new ApiError(404, userNotFoundString, [], []), { status: 404 })
        }

        const isValidUser = await compareHashPassword(zodCheckedLoginType.data.password, existingUserFromDB.password)
        if (!isValidUser) {
            return NextResponse.json(new ApiError(400, invalidPassword, [], []), { status: 400 });
        }
        const tokens = {
            accessToken: generateAccessToken(existingUserFromDB),
            refreshToken: generateRefreshToken(existingUserFromDB)
        }

        return NextResponse.json(new ApiResponse(200, loginSuccess, tokens), { status: 200 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
    }
}
