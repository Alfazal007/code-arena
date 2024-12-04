import { generateRustCodePartial, gettingUserInputsInRust } from "./generateRustCode.js";
import { generateTSCodePartial, gettingUserInputsInTS } from "./generateTypescriptCode.js";

export interface VariableType {
    nameOfVariable: string,
    typeOfVariable: string
}

export interface PartialCode {
    rustCode: string,
    tsCode: string,
    rustCompleteCode: string,
    tsCompleteCode: string
}

export function generateCode(lines: string[]): PartialCode {
    let functionName = "";
    let inputs: VariableType[] = []
    let outputs: string[] = []
    let inputStarted = false;
    let outputStarted = false;
    lines.map((line) => {
        if (line.includes("Function Name")) {
            let splitLines = line.split(":")[1]
            if (!splitLines) {
                throw new Error("Invalid format in function name")
            }
            functionName = splitLines.trim()
        }

        if (line.includes("Input Structure")) {
            inputStarted = true;
            outputStarted = false;
        }

        if (line.includes("Input Field") && inputStarted == true) {
            let type = line.split(" ")[2];
            let name = line.split(" ")[3];
            if (!type || !name) {
                throw new Error("Invalid format in input")
            }
            inputs.push({
                nameOfVariable: name,
                typeOfVariable: type
            })
        }

        if (line.includes("Output Structure")) {
            outputStarted = true;
            inputStarted = false;
        }

        if (line.includes("Output Field") && outputStarted == true) {
            let type = line.split(" ")[2];
            if (!type) {
                throw new Error("Invalid format in input")
            }
            outputs.push(type)
        }
    });

    const rustCodePartial = generateRustCodePartial(functionName, inputs, outputs);
    const rustCodeComplete = gettingUserInputsInRust(inputs, functionName);
    const tsCodePartial = generateTSCodePartial(functionName, inputs, outputs);
    const tsCodeComplete = gettingUserInputsInTS(inputs, functionName);

    return {
        rustCode: rustCodePartial,
        tsCode: tsCodePartial,
        rustCompleteCode: rustCodeComplete + rustCodePartial,
        tsCompleteCode: tsCodeComplete + tsCodePartial
    }
}
