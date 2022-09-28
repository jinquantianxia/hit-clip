import { AudioInfoObject } from "./audio";
import { VideoInfoObject } from "./video";

export const enum FileTypes {
	VIDEO = "VIDEO",
	AUDIO = "AUDIO",
	SUBTITLE = "SUBTITLE",
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

export interface VideoAndSubtitleCombineObject {
	key: string;
	choosed: boolean;
	video?: VideoInfoObject;
	subtitle?: string;
	successed: boolean;
	targetPath?: string;
	targetFormat: string;
}
