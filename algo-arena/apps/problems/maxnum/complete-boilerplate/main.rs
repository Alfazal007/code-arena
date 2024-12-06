
use std::fs::File;
use std::io::Read;

fn main() {
    let mut file = File::open("/dev/stdin").expect("Failed to open input file");
    let mut input = String::new();
    file.read_to_string(&mut input).expect("Failed to read file");
    let mut input_iter = input.trim().split_whitespace();

    let arr_count: usize = input_iter.next().unwrap().parse().unwrap();
    let arr: Vec<i32> = input_iter
        .take(arr_count)
        .map(|x| x.parse().unwrap())
        .collect();

    let res = maxelement(arr);
    println!("{}", res);
}
fn maxelement(arr: Vec<i32>)-> i32 {
    // Write your code here
}