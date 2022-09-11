import { open } from "@tauri-apps/api/dialog";
import { FileTypes } from "@src/types/common";
import { videoTypeArray, audioTypeArray } from "@src/constants/common";

export async function selectFiles(type: FileTypes, multiple = true) {
	let extensions: string[] = [];
	switch (type) {
		case FileTypes.AUDIO:
			extensions = audioTypeArray;
			break;
		case FileTypes.VIDEO:
			extensions = videoTypeArray;
			break;
		default:
			break;
	}
	const selected = await open({
		title:
			type === FileTypes.AUDIO
				? "选择音频文件(可多选)"
				: "选择视频文件(可多选)",
		multiple,
		filters: [
			{
				name: "choose media file",
				extensions,
			},
		],
	});
	if (Array.isArray(selected)) {
		// user selected multiple files
		return selected;
	} else if (selected === null) {
		// user cancelled the selection
		return [];
	} else {
		// user selected a single file
		return [selected];
	}
}

export async function selectDir() {
	const selected = await open({
		title: "选择目标文件夹",
		directory: true,
		multiple: false,
	});

	return selected ? (selected as string) : null;
}

export function filenameWithSuffix(
	filePath: string,
	withSuffix = true
): string {
	const arr = filePath.split("\\");
	const str = arr[arr.length - 1];
	return withSuffix ? str : str.split(".")[0];
}

export function fileSuffix(filePath: string) {
	const arr = filePath.split(".");
	return arr[arr.length - 1];
}

export function fileSizeToUnit(fileSize = 0, fileunit: string) {
	let output = "";
	switch (fileunit) {
		case "KB":
			output = `${(fileSize / 1024).toFixed(2)}KB`;
			break;
		case "MB":
			output = `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
			break;
		default:
			output = "0MB";
			break;
	}
	return output;
}

export async function downloadFileUrl(url: string, fileName: string) {
	const res = await fetch(url);
	const blob = await res.blob();
	const a = document.createElement("a");
	document.body.appendChild(a);
	a.style.display = "none";
	const url_1 = window.URL.createObjectURL(blob);
	a.href = url_1;
	a.download = fileName;
	a.click();
	document.body.removeChild(a);
	window.URL.revokeObjectURL(url_1);
}
