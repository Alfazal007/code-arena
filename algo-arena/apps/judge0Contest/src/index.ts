import { JudgeManager } from "./JudgeManager";

import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"]
})

const judgeManager = JudgeManager.getInstance();

const consumer = kafka.consumer({ groupId: "contestGroup" });

export type ReceivedSubmissionMessage = {
    submittedCode: string;
    language: "rust" | "javascript";
    problemId: string;
    userId: string;
    leaderBoardId: string;
    problemName: string;
}

async function main() {
    await consumer.connect();
    await consumer.subscribe({
        topic: "contestQueue", fromBeginning: false,
    })

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const submittedMessage = message.value?.toJSON().data.toString();
                if (submittedMessage) {
                    const decodedString = String.fromCharCode(...submittedMessage.split(',').map(Number));
                    let submission: ReceivedSubmissionMessage = JSON.parse(decodedString);
                    if (!submission.userId || !submission.language || !submission.problemId
                        || !submission.leaderBoardId || !submission.submittedCode || !submission.problemName) {
                        return;
                    }
                    await judgeManager.handleSubmissionInit(submission);
                }
            } catch (err) {
                console.log("invalid submission")
                console.log({ err })
            }
        },
    })
}

main();
