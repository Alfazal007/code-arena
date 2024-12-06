
const input = require("fs").readFileSync("/dev/stdin", "utf8").trim().split("\n").join(" ").split(" ");

        const arr_count = input.shift();
        const arr = input.splice(0, arr_count);

    // Call the function with inputs from the array
    const res = maxelement(arr);
    console.log(res);
function maxelement(arr) {
    // Write your code here
}