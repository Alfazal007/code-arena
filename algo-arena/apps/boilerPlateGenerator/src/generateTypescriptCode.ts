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




export function gettingUserInputsInTS(inputs: { nameOfVariable: string, typeOfVariable: string }[], functionName: string): string {
    let inputTaker = `
const input = require("fs").readFileSync("/dev/stdin", "utf8").trim().split("\\n").join(" ").split(" ");
`;

    inputs.forEach((input) => {
        const nextInputType = typescripttype(input.typeOfVariable);

        if (nextInputType.endsWith('[]')) {
            inputTaker += `
        const ${input.nameOfVariable}_count = input.shift();
        const ${input.nameOfVariable} = input.splice(0, ${input.nameOfVariable}_count);
`;
        } else {
            inputTaker += `
        const ${input.nameOfVariable} = ${nextInputType === 'number' ? 'parseFloat' : nextInputType === 'boolean' ? '(x => x === "true")' : ''}(input.shift());
            `;
        }
    });

    const inputToFunction = inputs.map(input => input.nameOfVariable).join(', ');

    inputTaker += `
    // Call the function with inputs from the array
    const res = ${functionName}(${inputToFunction});
    console.log(res);
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
