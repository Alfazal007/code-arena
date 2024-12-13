import { NextRequest, NextResponse } from "next/server";
import { envFiles } from "@/utils/envLoader";
import axios from "axios";
import { redisClient } from "@/utils/redis";
import prisma from "@repo/database/client";

type ResponseTokens = {
    token: string
}

type TokenReponse = {
    status_id: number
}

export async function POST(request: NextRequest) {
    try {
        const { requestData, secret, submissionId, contestId } = await request.json();
        const tokensArray: ResponseTokens[] = requestData;
        const leaderBoardIdString = submissionId as string;
        let contestIdKey = contestId as string;
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
        if (errPresent) {
            return NextResponse.json({}, { status: 200 })
        } else {
            if (!redisClient.isOpen) {
                await redisClient.connect()
            }
            let startTimeOfContest = await redisClient.get(`contest:${contestId}:startTime`) as string;
            if (!startTimeOfContest) {
                const contestInDB = await prisma.contest.findFirst({
                    where: {
                        id: contestId
                    }
                });
                if (contestInDB) {
                    await redisClient.set(`contest:${contestId}:startTime`, contestInDB.createdAt.toISOString());
                }
            }
            startTimeOfContest = await redisClient.get(`contest:${contestId}:startTime`) as string;
            const currentTime = new Date().toISOString();
            let points = calculatePoints(startTimeOfContest, currentTime);
            if (!contestId || !submissionId) {
                return NextResponse.json({}, { status: 200 })
            }
            await redisClient.zAdd(contestIdKey, { score: points, value: leaderBoardIdString });
        }
        return NextResponse.json({}, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({}, { status: 200 })
    }
}



function calculatePoints(retrievedTime: string, currentTime: string, maxPoints = 1000, decayRate = 0.001) {
    const retrievedTimestamp = new Date(retrievedTime).getTime() / 1000;
    const currentTimestamp = new Date(currentTime).getTime() / 1000;

    const timeDifference = Math.abs(currentTimestamp - retrievedTimestamp);

    const points = maxPoints * Math.exp(-decayRate * timeDifference);

    return Math.round(points);
}

