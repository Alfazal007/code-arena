import { VariableType } from "./generateCode.js";

export function generateTSCodePartial(functionName: string, inputs: VariableType[], outputs: string[]) {
    let tsCode = `function ${functionName}(`;
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        if (!input) {
            throw new Error("Invalid data")
        }
        tsCode += `${input.nameOfVariable}: ${typescripttype(input.typeOfVariable)}`;
        if (i < inputs.length - 1) {
            tsCode += ", ";
        }
    }

    tsCode += ")";

    if (outputs.length > 0) {
        tsCode += ": "
        if (outputs.length > 1) {
            tsCode += "["
        }
        for (let i = 0; i < outputs.length; i++) {
            let output = outputs[i];
            if (!output) {
                throw new Error("Invalid data")
            }
            tsCode += `${typescripttype(output)}`;
            if (i < outputs.length - 1) {
                tsCode += ", ";
            }
        }
        if (outputs.length > 1) {
            tsCode += "]"
        }
    }
    tsCode += ` {\n    // Write your code here\n}`;
    return tsCode;
}


export function gettingUserInputsInTS(inputs: VariableType[], functionName: string): string {
    let inputTaker = `
import * as fs from 'fs';
import * as path from 'path';

async function processInputFiles() {
    const testFolder = '../test/';

// Read all .txt files in the test directory
    const files = fs.readdirSync(testFolder)
        .filter(file => path.extname(file) === '.txt');

    for (const file of files) {
        const filePath = path.join(testFolder, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.trim().split('\\n');
        let lineIndex = 0;
    `;

    inputs.forEach((input) => {
        const nextInputType = typescripttype(input.typeOfVariable);

        if (nextInputType.endsWith('[]')) {
            // For array inputs, read count and the actual data
            inputTaker += `
        const ${input.nameOfVariable}_count: number = parseInt(lines[lineIndex++].trim());
        const ${input.nameOfVariable}: ${nextInputType} = lines[lineIndex++]
            .trim()
            .split(/\\s+/)
            .slice(0, ${input.nameOfVariable}_count)
            .map(x => ${nextInputType === 'number[]' ? 'parseFloat(x)' :
                    nextInputType === 'boolean[]' ? '(x === "true")' :
                        'x'
                });
            `;
        } else {
            inputTaker += `
        const ${input.nameOfVariable}: ${nextInputType} = ${nextInputType === 'number' ? 'parseFloat' :
                    nextInputType === 'boolean' ? '(x => x === "true")' :
                        ''
                }(lines[lineIndex++].trim());
            `;
        }
    });

    const inputToFunction = inputs.map(input => input.nameOfVariable).join(', ');
    const outputVariables = 'res';

    inputTaker += `
        // Call the function with inputs from the file
        const ${outputVariables} = ${functionName}(${inputToFunction});
    }
}

// Call the function to process input files
processInputFiles().catch(console.error);
`;

    return inputTaker;
}

function typescripttype(type: string) {
    switch (type) {
        case "int":
            return "number"
        case "float":
            return "number"
        case "char":
            return "string"
        case "bool":
            return "boolean"
        case "string":
            return "string"
        case "list<int>":
            return "number[]"
        case "list<float>":
            return "number[]"
        case "list<char>":
            return "string[]"
        case "list<bool>":
            return "boolean[]"
        default:
            return ""
    }
}
