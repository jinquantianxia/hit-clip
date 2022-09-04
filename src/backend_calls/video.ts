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
	output_file_path: string,
	scale: string
) {
	const ret = (await invoke(BACKEND_CALLS.CONVERT_VIDEO_TO_OTHER_FORMAT, {
		input: input_file_path,
		output: output_file_path,
		scale,
	})) as string;
	console.log("convert_video_to_other_format output: " + ret);
	return ret;
}

export async function queryVideosInfo(
	inputFilesPath: string[],
	isToAudio = false
) {
	return Promise.all(
		inputFilesPath.map(async (filePath, index) => {
			const ret = (await invoke(BACKEND_CALLS.QUERY_VIDEO_INFO, {
				input: filePath,
			})) as string;
			const infoArray = ret.split("\r\n");
			const retObj: VideoInfoObject = {
				id: index,
				name: filenameWithSuffix(filePath),
				filePath: filePath,
				format: fileSuffix(filePath),
				originResolution: "",
				resolution: "",
				size: 0,
				duration: "00:00:00",
				targetFormat: isToAudio ? "MP3" : "MP4",
				choosed: false,
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
					retObj.originResolution = arr[2];
					retObj.resolution = arr[2];
				}
			}
			console.log("video info output: " + retObj);
			return retObj;
		})
	);
}

export async function removeAudioFromVideo(
	input_file_path: string,
	output_file_path: string
) {
	const ret = (await invoke(BACKEND_CALLS.REMOVE_AUDIO_FROM_VIDEO, {
		input: input_file_path,
		output: output_file_path,
	})) as string;
	console.log("removeAudioFromVideo output: " + ret);
	return ret;
}
