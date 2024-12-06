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
        const res = await axios.post("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true&fields=*",
            {
                "source_code": "Y29uc3QgaW5wdXQgPSByZXF1aXJlKCJmcyIpLnJlYWRGaWxlU3luYygiL2Rldi9zdGRpbiIsICJ1dGY4IikudHJpbSgpLnNwbGl0KCJcbiIpLmpvaW4oIiAiKS5zcGxpdCgiICIpOwoKY29uc3QgYXJyX2NvdW50ID0gaW5wdXQuc2hpZnQoKTsKY29uc3QgYXJyID0gaW5wdXQuc3BsaWNlKDAsIGFycl9jb3VudCk7CgovLyBDYWxsIHRoZSBmdW5jdGlvbiB3aXRoIGlucHV0cyBmcm9tIHRoZSBhcnJheQpjb25zdCByZXMgPSBtYXhlbGVtZW50KGFycik7CmNvbnNvbGUubG9nKHJlcyk7CmZ1bmN0aW9uIG1heGVsZW1lbnQoYXJyKSB7CiAgICAvLyBXcml0ZSB5b3VyIGNvZGUgaGVyZQogICAgbGV0IHJlcyA9IDA7CiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgewogICAgICAgIHJlcyA9IE1hdGgubWF4KHJlcywgYXJyW2ldKTsKICAgIH0KICAgIHJldHVybiByZXM7Cn0=",
                "language_id": 93,
                "stdin": "NgoxMCAyMCAzMCA1NSA2OSA3Cg=="
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
