
use std::fs::File;
use std::io::Read;

fn main() {
    let mut file = File::open("/dev/stdin").expect("Failed to open input file");
    let mut input = String::new();
    file.read_to_string(&mut input).expect("Failed to read file");
    let mut input_iter = input.trim().split_whitespace();

    let num: i32 = input_iter.next().unwrap().parse().unwrap();

    let res = iseven(num);
    println!("{}", res);
}
fn iseven(num: i32)-> bool {
    // Write your code here
}