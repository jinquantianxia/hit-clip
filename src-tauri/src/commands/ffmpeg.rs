use std::fs;
use tauri::api::process::Command;
use tauri::command;

// ffmpeg.exe -i D:\test\rustProjects\tarui-demo\test.mp4 -hide_banner
#[command]
pub fn query_video_info(input: &str) -> String {
    let file_metadata = fs::metadata(input).unwrap();
    let cmd = Command::new_sidecar("ffmpeg").unwrap();
    let output = cmd
        .args(["-i", input, "-hide_banner"])
        .output()
        .expect("Failed to spawn sidecar");
    println!("output: {}", output.stderr);
    format!("file_size: {} \r\n {}", file_metadata.len(), output.stderr)
}

// ffmpeg -i input.mov output.mp4
#[command]
pub fn convert_video_to_other_format(input: &str, output: &str) -> String {
    println!("starting to convert...");
    let cmd = Command::new_sidecar("ffmpeg").unwrap();
    let output_obj = cmd
        .args(["-i", input, output])
        .output()
        .expect("Failed to spawn sidecar");
    println!("convert successfully.");
    format!("output: {}", output_obj.stderr)
}

// ffmpeg -i input.mp4 -vn output.mp3
#[command]
pub fn convert_video_to_audio(input: &str, output: &str) -> String {
    println!("starting to convert...");
    let cmd = Command::new_sidecar("ffmpeg").unwrap();
    let output_obj = cmd
        .args(["-i", input, "-vn", output])
        .output()
        .expect("Failed to spawn sidecar");
    println!("convert successfully.");
    format!("output: {}", output_obj.stderr)
}
