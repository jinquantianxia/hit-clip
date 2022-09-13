import { invoke } from "@tauri-apps/api";
import { REQ_PATHS } from "./req_path";
import { AudioInfoObject } from "@src/types/audio";
import { filenameWithSuffix, fileSuffix } from "@src/utils/file";
import { fetchPost } from "@src/utils/request";

export async function queryAudiosInfo(inputFilesPath: string[]) {
	return Promise.all(
		inputFilesPath.map(async (filePath, index) => {
			const ret = await fetchPost(REQ_PATHS.QUERY_AUDIO_INFO, {
				local_path: filePath,
			});
			const rawStr = await ret.text();
			const infoArray = rawStr.split("\r\n");
			const retObj: AudioInfoObject = {
				id: index,
				name: filenameWithSuffix(filePath),
				filePath: filePath,
				format: fileSuffix(filePath),
				bitrate: "0 kb/s",
				size: 0,
				duration: "00:00:00",
				targetFormat: "MP3",
				successed: false,
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
	const ret = await fetchPost(REQ_PATHS.CONVERT_AUDIO_TO_OTHER_FORMAT, {
		input: input_file_path,
		output: output_file_path,
		extra: "",
	});
	console.log("convert_Audio to_other_format output: " + ret);
	return ret;
}
