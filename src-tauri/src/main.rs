#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::env;
use tauri::{
    command, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

mod commands;

use commands::ffmpeg::{convert_video_to_audio, convert_video_to_other_format, query_video_info};
use commands::window::show_main_window;

#[command]
fn hello_test(word: String) -> String {
    // dump_av_info("D:/test/rustProjects/tarui-demo/test.mp4");
    format!("Hello, {}", word)
}

fn main() {
    env::set_var("RUST_BACKTRACE", "1");
    let quit = CustomMenuItem::new("quit".to_string(), "QUIT");
    let hide = CustomMenuItem::new("hide".to_string(), "HIDE");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide);
    let system_tray = SystemTray::new().with_menu(tray_menu);
    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "hide" => {
                    let window = app.get_window("main").unwrap();
                    window.hide().unwrap();
                }
                "quit" => {
                    let window = app.get_window("main").unwrap();
                    window.close().unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            window.open_devtools();
            app.listen_global("backend", |event| {
                println!(
                    "get backend messgae from fronrend {}",
                    event.payload().unwrap()
                );
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            convert_video_to_other_format,
            convert_video_to_audio,
            query_video_info,
            hello_test,
            show_main_window,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
