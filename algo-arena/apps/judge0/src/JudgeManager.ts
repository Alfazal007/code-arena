class JudgeManager {
    private static instance: JudgeManager;
    static getInstance(): JudgeManager {
        if (!JudgeManager.instance) {
            JudgeManager.instance = new JudgeManager()
        }
        return JudgeManager.instance;
    }


    private async createSummission() {
        console.log("fsd")
        await axios.post("https://judge0-ce.p.rapidapi.com/submissions?fields=*",
            {
                "source_code": "#include <stdio.h>\n\nint main(void) {\n  char name[10];\n  scanf(\"%s\", name);\n  printf(\"hello, %s\n\", name);\n  return 0;\n}",
                "language_id": 73,
                "stdin": "world"
            }
        )
    }
}
