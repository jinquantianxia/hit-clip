#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::env;
use tauri::api::process::{Command, CommandChild, CommandEvent};
use tauri::{
    command, CustomMenuItem, Manager, RunEvent, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

mod commands;

use commands::common::show_explorer;
use commands::window::show_main_window;

#[derive(Default)]
struct Backend(Option<CommandChild>);

fn main() {
    env::set_var("RUST_BACKTRACE", "1");
    let mut backend = Backend::default();
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
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![show_main_window, show_explorer])
        .build(tauri::generate_context!())
        .expect("Error building app")
        .run(move |app_handle, event| match event {
            RunEvent::Ready => {
                let (_, child) = Command::new_sidecar("yinyu-service")
                    .expect("Failed to create `backend_server` binary command")
                    .spawn()
                    .expect("Failed to spawn backend sidecar");

                _ = backend.0.insert(child);
            }
            RunEvent::ExitRequested { api, .. } => {
                if let Some(child) = backend.0.take() {
                    child.kill().expect("Failed to shutdown backend.");
                    println!("Backend gracefully shutdown.")
                }
            }
            _ => {}
        });
}
