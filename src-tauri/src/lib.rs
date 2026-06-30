// src-tauri/src/lib.rs
// Tauri application entry. Minimal for Phase 1.
// File system commands will be added in Phase 7.

use tauri_plugin_dialog::DialogExt;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running StoryBranch");
}
