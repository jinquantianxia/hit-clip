import { invoke } from "@tauri-apps/api/tauri";

export function showFileExplorer(localPath: string) {
	invoke("show_explorer", { path: localPath });
}
