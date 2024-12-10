import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../../utils/apiErrors";
import { contestNotFound, contestNotStartedYet, contestOver, contestStarted, issueWithDatabaseString, issueWithKafka, noRequestBodyString, problemNotFoundString, relogin, zodErrorsString } from "../../../../../responseStrings/responseStrings";
import { ApiResponse } from "../../../../../../utils/apiResponse";
import { zodTypes } from "@repo/zod/zodTypes";
import prisma from "@repo/database/client";
import { kafkaProducer } from "../../../../../../utils/kafka";

export async function POST(request: NextRequest) {
    const userHeader = request.headers.get('x-user');
    const currentUser = userHeader ? JSON.parse(userHeader) : null;
    if (!currentUser) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    const userId: string = currentUser.id;
    if (!userId) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    try {
        let requestBody;
        try {
            requestBody = await request.json();
        } catch (err) {
            return NextResponse.json(new ApiError(400, noRequestBodyString, [], []), { status: 400 })
        }
        const zodContestSubmission = zodTypes.contestSubmissionType.safeParse(requestBody);
        if (!zodContestSubmission.success) {
            const zodErrors: string[] = []
            zodContestSubmission.error.errors.map((err) => {
                zodErrors.push(err.message)
            })
            return NextResponse.json(new ApiError(400, zodErrorsString, [], zodErrors), { status: 400 })
        }
        const contestRequired = await prisma.contest.findFirst({
            where: {
                id: zodContestSubmission.data.contestId
            }
        });
        if (!contestRequired) {
            return NextResponse.json(new ApiError(404, contestNotFound, [], []), { status: 404 })
        }
        if (contestRequired.started != true) {
            return NextResponse.json(new ApiError(400, contestNotStartedYet, [], []), { status: 400 })
        }
        if (contestRequired.completed == true) {
            return NextResponse.json(new ApiError(400, contestOver, [], []), { status: 400 })
        }
        try {
            await kafkaProducer.connect()
        } catch (err) {
            return NextResponse.json(new ApiError(400, issueWithKafka, [], []), { status: 400 })
        }
        const problemFromDB = await prisma.problems.findFirst({
            where: {
                id: contestRequired.problemId
            }
        });
        if (!problemFromDB) {
            return NextResponse.json(new ApiError(404, problemNotFoundString, [], []), { status: 404 })
        }
        let codeToBeSubmitted = zodContestSubmission.data.code;
        if (zodContestSubmission.data.language == "rust") {
            codeToBeSubmitted += problemFromDB.inputTakingCodeRust
        } else {
            codeToBeSubmitted += problemFromDB.inputTakingCodeJS
        }

        let leaderBoardExists = false;
        let leaderBoardId = "";
        try {
            const existingLeaderBoard = await prisma.leaderBoard.findFirst({
                where: {
                    AND: [
                        { userId },
                        { contestId: zodContestSubmission.data.contestId }
                    ]
                }
            });
            if (existingLeaderBoard) {
                leaderBoardExists = true;
                leaderBoardId = existingLeaderBoard.id;
            }
        } catch (err) { }
        if (!leaderBoardExists) {
            const leaderBoard = await prisma.leaderBoard.create({
                data: {
                    userId,
                    contestId: zodContestSubmission.data.contestId
                }
            });
            leaderBoardId = leaderBoard.id;
        }
        let base64Code = btoa(codeToBeSubmitted);
        const dataToBeSentToKafka = {
            submittedCode: base64Code,
            language: zodContestSubmission.data.language,
            problemId: problemFromDB.id,
            userId: currentUser.id,
            leaderBoardId: leaderBoardId,
            problemName: problemFromDB.name
        }

        await kafkaProducer.send({
            topic: `contestQueue`,
            messages: [{
                value: JSON.stringify(dataToBeSentToKafka),
                key: currentUser.id
            }]
        });
        return NextResponse.json(new ApiResponse(200, contestStarted, {}), { status: 200 })
    } catch (err) {
        return NextResponse.json(new ApiError(400, issueWithDatabaseString, [], []), { status: 400 })
    }
}
