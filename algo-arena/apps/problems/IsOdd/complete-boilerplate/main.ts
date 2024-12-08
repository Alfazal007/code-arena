
const input = require("fs").readFileSync("/dev/stdin", "utf8").trim().split("\n").join(" ").split(" ");

        const num = parseFloat(input.shift());
            
    // Call the function with inputs from the array
    const res = isodd(num);
    console.log(res);
function isodd(num) {
    // Write your code here
}