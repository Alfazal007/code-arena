import fs from "fs";
import { generateCode } from "./generateCode.js";
import path from "path"

function main() {
    const pathToTheStructureFile = process.env.path;
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
    fs.writeFileSync(path.join(partialBoilerPlatePath, "partial.ts"), codes.tsCode, 'utf8');
}

main();
