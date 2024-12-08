
const input = require("fs").readFileSync("/dev/stdin", "utf8").trim().split("\n").join(" ").split(" ");

        const num = parseFloat(input.shift());
            
    // Call the function with inputs from the array
    const res = iseven(num);
    console.log(res);
function iseven(num) {
    // Write your code here
}