import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../../utils/apiErrors";
import { issueWithDatabaseString, issueWithKafka, noRequestBodyString, relogin, successfulProblemSubmission, zodErrorsString } from "../../../../../responseStrings/responseStrings";
import { zodTypes } from "@repo/zod/zodTypes";
import { kafkaProducer } from "../../../../../../utils/kafka";
import prisma from "@repo/database/client";
import { ApiResponse } from "../../../../../../utils/apiResponse";

export async function POST(request: NextRequest) {
    const userHeader = request.headers.get('x-user');
    const currentUser: null | {
        username: string;
        email: string;
        password: string;
        id: string;
        isPremium: boolean;
    } = userHeader ? JSON.parse(userHeader) : null;
    if (!currentUser) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }

    try {
        let requestBody;
        try {
            requestBody = await request.json();
        } catch (err) {
            return NextResponse.json(new ApiError(400, noRequestBodyString, [], []), { status: 400 })
        }
        const zodParsedData = zodTypes.createSubmissionType.safeParse(requestBody);
        if (!zodParsedData.success) {
            const zodErrors: string[] = []
            zodParsedData.error.errors.map((err) => {
                zodErrors.push(err.message)
            })
            return NextResponse.json(new ApiError(400, zodErrorsString, [], zodErrors), { status: 400 })
        }
        let submittedProblem;
        let problemFromDB;
        try {
            await kafkaProducer.connect()

            try {
                problemFromDB = await prisma.problems.findFirst({
                    where: {
                        id: zodParsedData.data.problemId
                    },
                    select: {
                        id: true,
                        inputTakingCodeJS: true,
                        inputTakingCodeRust: true,
                        name: true
                    }
                });
                if (!problemFromDB) {
                    return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
                }
                submittedProblem = await prisma.userProblem.create({
                    data: {
                        userId: currentUser.id,
                        problemId: zodParsedData.data.problemId,
                    }
                });
            } catch (err) {
                return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
            }
            let codeToBeSubmitted = zodParsedData.data.code;
            if (zodParsedData.data.language == "rust") {
                codeToBeSubmitted += problemFromDB.inputTakingCodeRust
            } else {
                codeToBeSubmitted += problemFromDB.inputTakingCodeJS
            }
            let base64Code = btoa(codeToBeSubmitted);
            const dataToBeSentToKafka = {
                submittedCode: base64Code,
                language: zodParsedData.data.language,
                problemId: zodParsedData.data.problemId,
                userId: currentUser.id,
                submissionId: submittedProblem.id,
                problemName: problemFromDB.name
            }

            await kafkaProducer.send({
                topic: `premiumQueue-${currentUser.isPremium}`,
                messages: [{
                    value: JSON.stringify(dataToBeSentToKafka),
                    key: currentUser.id
                }]
            });
        } catch (err) {
            return NextResponse.json(new ApiError(400, issueWithKafka, [], []), { status: 400 })
        }

        return NextResponse.json(new ApiResponse(200, successfulProblemSubmission, {
            problemSubmissionId: submittedProblem.id
        }), { status: 200 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
    }
}
