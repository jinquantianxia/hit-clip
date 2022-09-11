import { invoke } from "@tauri-apps/api";
import { REQ_PATHS } from "./req_path";
import { VideoInfoObject } from "@src/types/video";
import {
	filenameWithSuffix,
	fileSuffix,
	fileSizeToUnit,
} from "@src/utils/file";
import { fetchPost } from "@src/utils/request";

export async function convertVideoToAudio(
	input_file_path: string,
	output_file_path: string
) {
	const ret = await fetchPost(REQ_PATHS.CONVERT_VIDEO_TO_AUDIO, {
		input: input_file_path,
		output: output_file_path,
		extra: "",
	});
	console.log("convert_video_to_audio output: " + ret);
	return ret;
}

export async function convertVideoToOtherVideoType(
	input_file_path: string,
	output_file_path: string,
	scale: string
) {
	const ret = await fetchPost(REQ_PATHS.CONVERT_VIDEO_TO_OTHER_FORMAT, {
		input: input_file_path,
		output: output_file_path,
		extra: scale,
	});
	console.log("convert_video_to_other_format output: " + ret);
	return ret;
}

export async function queryVideosInfo(
	inputFilesPath: string[],
	isToAudio = false
) {
	return Promise.all(
		inputFilesPath.map(async (filePath, index) => {
			const ret = await fetchPost(REQ_PATHS.QUERY_VIDEO_INFO, {
				local_path: filePath,
			});
			const rawStr = await ret.text();
			const infoArray = rawStr.split("\r\n");
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
	const ret = await fetchPost(REQ_PATHS.REMOVE_AUDIO_FROM_VIDEO, {
		input: input_file_path,
		output: output_file_path,
		extra: "",
	});
	console.log("removeAudioFromVideo output: " + ret);
	return ret;
}

export async function combineVideoAndAudio(
	video_path: string,
	audio_path: string,
	output_file_path: string
) {
	const ret = await fetchPost(REQ_PATHS.COMBINE_VIDEO_AND_AUDIO, {
		input: video_path,
		output: output_file_path,
		extra: audio_path,
	});
	console.log("combineVideoAndAudio output: " + ret);
	return ret;
}
