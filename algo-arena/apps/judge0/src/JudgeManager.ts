import { envFiles } from "./loadEnv";
import axios from "axios";

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
}
