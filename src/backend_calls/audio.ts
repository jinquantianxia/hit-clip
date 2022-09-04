import { invoke } from "@tauri-apps/api";
import { BACKEND_CALLS } from "./calls";
import { AudioInfoObject } from "@src/types/audio";
import {
	filenameWithSuffix,
	fileSuffix,
	fileSizeToUnit,
} from "@src/utils/file";

export async function queryAudiosInfo(inputFilesPath: string[]) {
	return Promise.all(
		inputFilesPath.map(async (filePath, index) => {
			const ret = (await invoke(BACKEND_CALLS.QUERY_AUDIO_INFO, {
				input: filePath,
			})) as string;
			const infoArray = ret.split("\r\n");
			const retObj: AudioInfoObject = {
				id: index,
				name: filenameWithSuffix(filePath),
				filePath: filePath,
				format: fileSuffix(filePath),
				bitrate: "0 kb/s",
				size: 0,
				duration: "00:00:00",
				targetFormat: "MP3",
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
					retObj.bitrate = arr[2].split(": ")[1];
				}
			}
			console.log("file info output: " + retObj);
			return retObj;
		})
	);
}

export async function convertAudioToOtherAudioType(
	input_file_path: string,
	output_file_path: string
) {
	const ret = (await invoke(BACKEND_CALLS.CONVERT_AUDIO_TO_OTHER_FORMAT, {
		input: input_file_path,
		output: output_file_path,
	})) as string;
	console.log("convert_Audio to_other_format output: " + ret);
	return ret;
}
