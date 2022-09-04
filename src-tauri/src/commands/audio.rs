use std::fs;
use tauri::api::process::Command;
use tauri::command;

// ffmpeg.exe -i D:\test\rustProjects\tarui-demo\test.mp3 -hide_banner
#[command]
pub fn query_audio_info(input: &str) -> String {
    let file_metadata = fs::metadata(input).unwrap();
    let cmd = Command::new_sidecar("ffmpeg").unwrap();
    let output = cmd
        .args(["-i", input, "-hide_banner"])
        .output()
        .expect("Failed to spawn sidecar");
    println!("output: {}", output.stderr);
    format!("file_size: {} \r\n {}", file_metadata.len(), output.stderr)
}

// ffmpeg -i input.avi -vf scale=320:240 output.avi
#[command]
pub fn convert_audio_to_other_format(input: &str, output: &str) -> String {
    println!("starting to convert audio...");
    let cmd = Command::new_sidecar("ffmpeg").unwrap();
    let output_obj = cmd
        .args(["-i", input, output])
        .output()
        .expect("Failed to spawn sidecar");
    println!("convert audio successfully.");
    format!("output: {}", output_obj.stderr)
}
