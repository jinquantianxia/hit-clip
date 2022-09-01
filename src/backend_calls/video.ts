import { invoke } from "@tauri-apps/api";
import { BACKEND_CALLS } from "./calls";
import { VideoInfoObject } from "@src/types/video";
import {
	filenameWithSuffix,
	fileSuffix,
	fileSizeToUnit,
} from "@src/utils/file";

export async function convertVideoToAudio(
	input_file_path: string,
	output_file_path: string
) {
	const ret = (await invoke(BACKEND_CALLS.CONVERT_VIDEO_TO_AUDIO, {
		input: input_file_path,
		output: output_file_path,
	})) as string;
	console.log("convert_video_to_audio output: " + ret);
	return ret;
}

export async function convertVideoToOtherVideoType(
	input_file_path: string,
	output_file_path: string
) {
	const ret = (await invoke(BACKEND_CALLS.CONVERT_VIDEO_TO_OTHER_FORMAT, {
		input: input_file_path,
		output: output_file_path,
	})) as string;
	console.log("convert_video_to_other_format output: " + ret);
	return ret;
}

export async function queryVideoInfo(inputFilePath: string) {
	const ret = (await invoke(BACKEND_CALLS.QUERY_VIDEO_INFO, {
		input: inputFilePath,
	})) as string;
	const infoArray = ret.split("\r\n");
	const retObj: VideoInfoObject = {
		name: filenameWithSuffix(inputFilePath),
		filePath: inputFilePath,
		format: fileSuffix(inputFilePath),
		resolve: "0x0",
		size: 0,
		duration: "00:00:00",
	};
	for (let line of infoArray) {
		if (line.includes("file_size")) {
			const size = line.split(":")[1];
			retObj.size = Number(size);
		}
		if (line.includes("Duration:")) {
			const arr = line.split(",");
			retObj.duration = arr[0].split(": ")[1];
		}
		if (line.includes("Video:")) {
			const arr = line.split(",");
			retObj.resolve = arr[2];
		}
	}
	console.log("video info output: " + retObj);
	return retObj;
}
