
const input = require("fs").readFileSync("/dev/stdin", "utf8").trim().split("\n").join(" ").split(" ");

const arr_count = input.shift();
const arr = input.splice(0, arr_count);

// Call the function with inputs from the array
const res = maxelement(arr);
console.log(res);
function maxelement(arr: number[]) {
    // Write your code here
    let res = 0;
    for (let i = 0; i < arr.length; i++) {
        res = Math.max(res, arr[i]);
    }
    return res;
}
