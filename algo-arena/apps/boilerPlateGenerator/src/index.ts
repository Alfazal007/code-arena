import fs from "fs";
import { generateCode } from "./generateCode.js";
import path from "path"
import prisma from "@repo/database/client";

async function main() {
    try {
        const pathToTheStructureFile = process.env.path;
        const testCases = parseInt(process.env.tests as string);
        if (!pathToTheStructureFile) {
            return;
        }
        const data = fs.readFileSync(pathToTheStructureFile, 'utf8');
        const lines = data.split('\n');

        let partialBoilerPlatePath = pathToTheStructureFile.replace("structure.md", "/partial-boilerplate")
        let fullBoilerPlatePath = pathToTheStructureFile.replace("structure.md", "/complete-boilerplate")
        let codes = generateCode(lines);
        fs.mkdirSync(partialBoilerPlatePath, { recursive: true });
        fs.mkdirSync(fullBoilerPlatePath, { recursive: true });
        fs.writeFileSync(path.join(partialBoilerPlatePath, "partial.rs"), codes.rustCode, 'utf8');
        fs.writeFileSync(path.join(fullBoilerPlatePath, "main.rs"), codes.rustCompleteCode, 'utf8');
        fs.writeFileSync(path.join(partialBoilerPlatePath, "partial.ts"), codes.jsCode, 'utf8');
        fs.writeFileSync(path.join(fullBoilerPlatePath, "main.ts"), codes.jsCompleteCode, 'utf8');
        try {
            const createdProblem = await prisma.default.problems.create({
                data: {
                    name: codes.nameOfProgram,
                    testCases: testCases,
                    fullCodeJS: codes.jsCompleteCode,
                    halfCodeJS: codes.jsCode,
                    fullCodeRust: codes.rustCompleteCode,
                    halfCodeRust: codes.rustCode
                }
            });
            console.log({ createdProblem })
        } catch (err) {
            console.log("Issue writing to the database");
            console.log(err);
        }
    } catch (err) {
        console.log("Issue while generating the code not written to db yet")
        console.log(err)
    }
}

main();
