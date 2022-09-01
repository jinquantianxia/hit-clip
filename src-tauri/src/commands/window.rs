use tauri::{command, Manager};

#[command]
pub fn show_main_window(window: tauri::Window) {
    if let Some(window) = window.get_window("splashscreen") {
        window.close().unwrap();
    }
    window.get_window("main").unwrap().show().unwrap();
}
