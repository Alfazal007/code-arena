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

export function gettingUserInputsInRust(inputs: VariableType[], functionName: string): string {
    let inputTaker = `
use std::fs::File;
use std::io::Read;

fn main() {
    let mut file = File::open("/dev/stdin").expect("Failed to open input file");
    let mut input = String::new();
    file.read_to_string(&mut input).expect("Failed to read file");
    let mut input_iter = input.trim().split_whitespace();
`;

    inputs.forEach((input) => {
        const rustVarType = rustType(input.typeOfVariable);

        if (rustVarType.startsWith("Vec")) {
            inputTaker += `
    let ${input.nameOfVariable}_count: usize = input_iter.next().unwrap().parse().unwrap();
    let ${input.nameOfVariable}: ${rustVarType} = input_iter
        .take(${input.nameOfVariable}_count)
        .map(|x| x.parse().unwrap())
        .collect();
`;
        } else {
            inputTaker += `
    let ${input.nameOfVariable}: ${rustVarType} = input_iter.next().unwrap().parse().unwrap();
`;
        }
    });

    const inputToFunction = inputs.map(input => input.nameOfVariable).join(", ");

    inputTaker += `
    let res = ${functionName}(${inputToFunction});
    println!("{}", res);
}
`;
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
