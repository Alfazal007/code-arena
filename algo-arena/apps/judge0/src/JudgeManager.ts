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

    async createSummission() {
        const res = await axios.post("https://judge0-ce.p.rapidapi.com/submissions?fields=*",
            {
                "source_code": "console.log('Hello from typescipt')",
                "language_id": 74,
            },
            {
                headers: {
                    "x-rapidapi-host": envFiles.apiHost,
                    "x-rapidapi-key": envFiles.apiKey
                }
            }
        );
        console.log({ res: res.data })
    }
}
