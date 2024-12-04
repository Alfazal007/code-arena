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
