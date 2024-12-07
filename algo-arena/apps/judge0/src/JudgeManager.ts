import { ReceivedSubmissionMessage } from ".";
import { envFiles } from "./loadEnv";
import axios from "axios";
import fs from "fs";
import path from "path";
import { env } from "process";

type ResponseTokens = {
    token: string
}
type DataToBeSent = { requestData: ResponseTokens[], secret: string, submissionId: string }

export class JudgeManager {
    private static instance: JudgeManager;
    static getInstance(): JudgeManager {
        if (!JudgeManager.instance) {
            JudgeManager.instance = new JudgeManager()
        }
        return JudgeManager.instance;
    }

    async createRustSummission({ stdin, submissionInfo }: { submissionInfo: ReceivedSubmissionMessage, stdin: string[] }) {
        try {
            const outputsRequired = this.readOutputFile(submissionInfo.problemName);
            const inputsToJudge: { source_code: string, language_id: number, expected_output: string }[] = [];
            for (let i = 0; i < outputsRequired.length; i++) {
                inputsToJudge.push({
                    source_code: submissionInfo.submittedCode,
                    language_id: 73,
                    expected_output: outputsRequired[i] as string
                });
            }
            const res = await axios.post("https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=true",
                {
                    "submissions": inputsToJudge
                },
                {
                    headers: {
                        "x-rapidapi-host": envFiles.apiHost,
                        "x-rapidapi-key": envFiles.apiKey
                    }
                }
            );
            if (res.status != 201) {
                return;
            } else {
                const tokens = res.data as ResponseTokens[];
                const dataToBeSent: DataToBeSent = {
                    secret: envFiles.secretUrl,
                    submissionId: submissionInfo.submissionId,
                    requestData: tokens
                }
                await axios.post("http://localhost:3001/api/updateSubmission", dataToBeSent);
            }
        } catch (err) {
            console.log(err)
        }
    }

    async createJSSummission({ stdin, submissionInfo }: { submissionInfo: ReceivedSubmissionMessage, stdin: string[] }) {
        const res = await axios.post("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true&fields=*",
            {
                "source_code": submissionInfo.submittedCode,
                "language_id": 93,
                "stdin": stdin,
                "cpu_time_limit": 2
            },
            {
                headers: {
                    "x-rapidapi-host": envFiles.apiHost,
                    "x-rapidapi-key": envFiles.apiKey
                }
            }
        );
        console.log({ res: res.data })
        // update in the database
    }

    async handleSubmissionInit(submission: ReceivedSubmissionMessage) {
        const testCaseFolder = path.resolve(__dirname, `../../problems/${submission.problemName}/test`);
        let inputs: string[] = [];
        try {
            if (!fs.existsSync(testCaseFolder)) {
                throw new Error(`Directory does not exist: ${testCaseFolder}`);
            }

            const files = fs.readdirSync(testCaseFolder);

            inputs = files
                .filter(file => path.extname(file) === '.txt')
                .map(file => {
                    const filePath = path.join(testCaseFolder, file);
                    return btoa(fs.readFileSync(filePath, 'utf8'));
                });
        } catch (error) {
            console.error('Error reading test case files:', error);
            throw error;
        }
        if (submission.language == "rust") {
            await this.createRustSummission({ submissionInfo: submission, stdin: inputs })
        } else {
            await this.createJSSummission({ submissionInfo: submission, stdin: inputs })
        }
    }

    private readOutputFile(problemName: string) {
        const outputFolder = path.resolve(__dirname, `../../problems/${problemName}/output`);
        let outputs: string[] = [];
        try {
            if (!fs.existsSync(outputFolder)) {
                throw new Error(`Directory does not exist: ${outputFolder}`);
            }

            const files = fs.readdirSync(outputFolder);
            outputs = files
                .filter(file => path.extname(file) === '.txt')
                .map(file => {
                    const filePath = path.join(outputFolder, file);
                    return btoa(fs.readFileSync(filePath, 'utf8'));
                });
        } catch (error) {
            console.error('Error reading test case files:', error);
            throw error;
        }
        return outputs;
    }
}

