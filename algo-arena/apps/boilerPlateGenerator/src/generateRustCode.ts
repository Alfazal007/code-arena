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
use std::fs::{self, File};
use std::io::{self, BufRead};
use std::path::Path;

fn main() {
    let test_folder = "../test/";
    let paths = fs::read_dir(test_folder)
        .expect("Failed to read the test directory");

    // Iterate over each file in the test directory
    for path in paths {
        let path = path.expect("Failed to read path").path();
        if path.extension().and_then(|s| s.to_str()) == Some("txt") {
            let input = File::open(&path).expect("Failed to open file");
            let buffered = io::BufReader::new(input);
            let mut lines = buffered.lines();
    `;

    inputs.map((input) => {
        const nextInputType = rustType(input.typeOfVariable);
        if (nextInputType.includes("Vec")) {
            // For vector inputs, read count and the actual data
            inputTaker += `
            let ${input.nameOfVariable}_count: usize = lines.next()
                .expect("Missing line for ${input.nameOfVariable} count")
                .expect("Failed to read line")
                .trim()
                .parse()
                .expect("Invalid number for ${input.nameOfVariable} count");

            let ${input.nameOfVariable}: Vec<${nextInputType.replace("Vec<", "").replace(">", "")}> = lines.next()
                .expect("Missing line for ${input.nameOfVariable} data")
                .expect("Failed to read line")
                .trim()
                .split_whitespace()
                .take(${input.nameOfVariable}_count)
                .map(|x| x.parse().expect("Invalid input in ${input.nameOfVariable}"))
                .collect();
            `;
        } else {
            inputTaker += `
            let ${input.nameOfVariable}: ${nextInputType} = lines.next()
                .expect("Missing line for ${input.nameOfVariable}")
                .expect("Failed to read line")
                .trim()
                .parse()
                .expect("Invalid input for ${input.nameOfVariable}");
            `;
        }
    });

    let inputToFunction: string[] = []
    inputs.map((input) => {
        inputToFunction.push(input.nameOfVariable)
    });
    let variables = inputToFunction.join(", ")
    let outputVariables = "";
    outputVariables = "res"

    inputTaker += `
            // Call the function with inputs from the file
            let ${outputVariables} = ${functionName}(${variables});
        }
    }
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
