import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/database/client";
import { envFiles } from "@/utils/envLoader";
import axios from "axios";

type ResponseTokens = {
    token: string
}

type TokenReponse = {
    status_id: number
}

export async function POST(request: NextRequest) {
    try {
        const { requestData, secret, submissionId } = await request.json();
        const tokensArray: ResponseTokens[] = requestData;
        const submissionIdString = submissionId as string;
        if (secret != envFiles.secretUrl) {
            return NextResponse.json({}, { status: 401 })
        }
        let errMessage = "";
        let errPresent = false;
        const results = []
        let completedTestCases = 0;
        for (let i = 0; i < tokensArray.length; i++) {
            const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokensArray[i].token}?fields=status_id&wait=true`;
            const response = await axios.get(url, {
                headers: {
                    "x-rapidapi-host": envFiles.apiHost,
                    "x-rapidapi-key": envFiles.apiKey
                }
            }
            );
            const body = response.data as TokenReponse;
            if (body.status_id == 2 || body.status_id == 1) {
                i--;
                continue;
            }
            if (body.status_id == 3) {
                results.push(true);
                completedTestCases++;
            } else if (body.status_id == 5) {
                errMessage = "Time Limit exceeded"
                errPresent = true;
                results.push(false);
            } else {
                errMessage = "Wrong answer"
                errPresent = true;
                results.push(false);
            }
        }
        await prisma.userProblem.update({
            where: {
                id: submissionIdString
            },
            data: {
                isErrorPresent: errPresent,
                errorMessage: errMessage,
                isCompleted: !errPresent,
                testcaseStatus: results,
                completedTestCases
            }
        });
        return NextResponse.json({}, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({}, { status: 200 })
    }
}
