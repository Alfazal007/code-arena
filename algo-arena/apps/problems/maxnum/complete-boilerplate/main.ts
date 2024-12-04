
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
        const lines = fileContent.trim().split('\n');
        let lineIndex = 0;
    
        const arr_count: number = parseInt(lines[lineIndex++].trim());
        const arr: number[] = lines[lineIndex++]
            .trim()
            .split(/\s+/)
            .slice(0, arr_count)
            .map(x => parseFloat(x));
            
        // Call the function with inputs from the file
        const res = maxelement(arr);
    }
}

// Call the function to process input files
processInputFiles().catch(console.error);
function maxelement(arr: number[]): number {
    // Write your code here
}