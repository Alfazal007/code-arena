import fs from "fs";
import { generateCode } from "./generateCode.js";

function main() {
    const pathToTheStructureFile = process.env.path;
    if (!pathToTheStructureFile) {
        return;
    }
    const data = fs.readFileSync(pathToTheStructureFile, 'utf8');
    const lines = data.split('\n');
    let codes = generateCode(lines);
    console.log({ codes })
}

main();
