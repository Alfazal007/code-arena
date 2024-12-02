import prisma from "@repo/database/client";
import { ApiResponse } from "../../../../utils/apiResponse";
import { NextResponse, NextRequest } from "next/server";
import { ApiError } from "../../../../utils/apiErrors";
import { zodTypes } from "@repo/zod/zodTypes"
import { createdNewUserString, issueWithDatabaseString, noRequestBodyString, similarUserExistsString, zodErrorsString } from "../../../responseStrings/responseStrings";
import { hashPassword } from "../../../../utils/hashPassword";

export async function POST(request: NextRequest) {
    try {
        let requestBody;
        try {
            requestBody = await request.json()
        } catch (err) {
            return NextResponse.json(new ApiError(400, noRequestBodyString, [], []), { status: 400 })
        }

        const zodCheckedBody = zodTypes.signupType.safeParse(requestBody)
        if (!zodCheckedBody.success) {
            const zodErrors: string[] = []
            zodCheckedBody.error.errors.map((err) => {
                zodErrors.push(err.message)
            })
            return NextResponse.json(new ApiError(400, zodErrorsString, [], zodErrors), { status: 400 })
        }

        const userExistsInDB = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: zodCheckedBody.data.username },
                    { email: zodCheckedBody.data.email }
                ]
            }
        });
        if (userExistsInDB) {
            return NextResponse.json(new ApiError(400, similarUserExistsString, [], []), { status: 400 })
        }

        const hashedPassword = await hashPassword(zodCheckedBody.data.password);

        const newUser = await prisma.user.create({
            data: {
                username: zodCheckedBody.data.username,
                email: zodCheckedBody.data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
                email: true,
            }
        });

        return NextResponse.json(new ApiResponse(201, createdNewUserString, newUser), { status: 201 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
    }
}
