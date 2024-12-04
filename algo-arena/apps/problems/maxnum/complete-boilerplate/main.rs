
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
    
            let arr_count: usize = lines.next()
                .expect("Missing line for arr count")
                .expect("Failed to read line")
                .trim()
                .parse()
                .expect("Invalid number for arr count");

            let arr: Vec<i32> = lines.next()
                .expect("Missing line for arr data")
                .expect("Failed to read line")
                .trim()
                .split_whitespace()
                .take(arr_count)
                .map(|x| x.parse().expect("Invalid input in arr"))
                .collect();
            
            // Call the function with inputs from the file
            let res = maxelement(arr);
        }
    }
}
fn maxelement(arr: Vec<i32>)-> i32 {
    // Write your code here
}