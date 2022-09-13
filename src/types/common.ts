import { AudioInfoObject } from "./audio";
import { VideoInfoObject } from "./video";

export const enum FileTypes {
	VIDEO = "VIDEO",
	AUDIO = "AUDIO",
}

export interface VideoAndAudioCombineObject {
	key: string;
	choosed: boolean;
	audio?: AudioInfoObject;
	video?: VideoInfoObject;
	successed: boolean;
	targetPath?: string;
	targetFormat: string;
}
