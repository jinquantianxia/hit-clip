import { open } from "@tauri-apps/api/dialog";

export async function selectFile() {
	const selected = await open({
		multiple: false,
		filters: [
			{
				name: "choose media file",
				extensions: ["mp4", "mp3", "avi", "3gp", "mpg", "mov", "vob", "webm"],
			},
		],
	});
	return selected;
	// if (Array.isArray(selected)) {
	// 	// user selected multiple files
	// } else if (selected === null) {
	// 	// user cancelled the selection
	// } else {
	// 	// user selected a single file
	// }
}

export function filenameWithSuffix(
	filePath: string,
	withSuffix = true
): string {
	const arr = filePath.split("\\");
	const str = arr[arr.length - 1];
	return withSuffix ? str : str.split(".")[1];
}

export function fileSuffix(filePath: string) {
	const arr = filePath.split(".");
	return arr[arr.length - 1];
}

export function fileSizeToUnit(fileSize: number, fileunit: string) {
	let output = "";
	switch (fileunit) {
		case "KB":
			output = `${(fileSize / 1024).toFixed(2)}KB`;
			break;
		case "MB":
			output = `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
			break;
		default:
			break;
	}
	return output;
}
