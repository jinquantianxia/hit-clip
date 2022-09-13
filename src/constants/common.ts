export const videoTypeArray = [
	"MP4",
	"AVI",
	// "3GP",
	"MPG",
	"MOV",
	"VOB",
	"WEBM",
];

export const audioTypeArray = [
	"MP3",
	"FLAC",
	"WAV",
	"M4A",
	"WMA",
	"AAC",
	"AC3",
];

export interface VideoResolution {
	name: string;
	value: string;
	choosed: boolean;
}

export const videoResolutions: VideoResolution[] = [
	{
		name: "原视频分辨率",
		value: "0",
		choosed: true,
	},
	{
		name: "1080P(1920*1080)",
		value: "1920x1080",
		choosed: false,
	},
	{
		name: "720P(1080*720)",
		value: "1080x720",
		choosed: false,
	},
	{
		name: "640P(960*640)",
		value: "960x640",
		choosed: false,
	},
	{
		name: "480P(640*480)",
		value: "640x480",
		choosed: false,
	},
	{
		name: "4K(4096*2160)",
		value: "4096x2160",
		choosed: false,
	},
];
