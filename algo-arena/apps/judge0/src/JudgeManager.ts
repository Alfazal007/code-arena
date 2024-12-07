import { ReceivedSubmissionMessage } from ".";
import { envFiles } from "./loadEnv";
import axios from "axios";
import fs from "fs";
import path from "path";

export class JudgeManager {
    private static instance: JudgeManager;
    static getInstance(): JudgeManager {
        if (!JudgeManager.instance) {
            JudgeManager.instance = new JudgeManager()
        }
        return JudgeManager.instance;
    }

    async createRustSummission({ sourceCode, stdin, testNo, programId }: { sourceCode: string, stdin: string, testNo: number, programId: string }) {
        const res = await axios.post("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true&fields=*",
            {
                "source_code": sourceCode,
                "language_id": 73,//93
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

    async createJSSummission({ sourceCode, stdin, testNo, programId }: { sourceCode: string, stdin: string, testNo: number, programId: string }) {
        const res = await axios.post("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true&fields=*",
            {
                "source_code": sourceCode,
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
        console.log(inputs)
    }
}

