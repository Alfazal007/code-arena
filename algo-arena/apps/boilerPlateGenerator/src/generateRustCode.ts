import { VariableType } from "./generateCode.js";

export function generateRustCodePartial(functionName: string, inputs: VariableType[], outputs: string[]) {
    let rustCode = `fn ${functionName}(`;
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        if (!input) {
            throw new Error("Invalid data")
        }
        rustCode += `${input.nameOfVariable}: ${rustType(input.typeOfVariable)}`;
        if (i < inputs.length - 1) {
            rustCode += ", ";
        }
    }

    rustCode += ")";

    if (outputs.length > 0) {
        rustCode += "-> "
        if (outputs.length > 1) {
            rustCode += "("
        }
        for (let i = 0; i < outputs.length; i++) {
            let output = outputs[i];
            if (!output) {
                throw new Error("Invalid data")
            }
            rustCode += `${rustType(output)}`;
            if (i < outputs.length - 1) {
                rustCode += ", ";
            }
        }
        if (outputs.length > 1) {
            rustCode += ")"
        }
    }
    rustCode += " {"
    rustCode += `\n    // Write your code here`
    rustCode += "\n}"
    return rustCode;
}

export function gettingUserInputsInRust(inputs: VariableType[], path: string): string {
    let inputTaker = ``;
    inputs.map((input) => {
    });
    return inputTaker;
}

function rustType(type: string) {
    switch (type) {
        case "int":
            return "i32"
        case "float":
            return "f64"
        case "char":
            return "char"
        case "bool":
            return "bool"
        case "string":
            return "String"
        case "list<int>":
            return "Vec<i32>"
        case "list<float>":
            return "Vec<f64>"
        case "list<char>":
            return "Vec<char>"
        case "list<bool>":
            return "Vec<bool>"
        default:
            return ""
    }
}
