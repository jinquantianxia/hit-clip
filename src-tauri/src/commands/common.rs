use std::process::Command;
use tauri::{command, Manager};

#[command]
pub fn show_explorer(path: &str) {
    println!("Opening");
    Command::new("explorer")
        .arg(path) // <- Specify the directory you'd like to open.
        .spawn()
        .unwrap();
}
