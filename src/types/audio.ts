export interface AudioInfoObject {
	id: number;
	name: string;
	filePath: string;
	format: string;
	bitrate: string; // 比特率
	size: number;
	duration: string;
	choosed: boolean;
	successed: boolean;
	targetFormat?: string;
}

export interface AudioMaterialItemInfo {
	title: string;
	url: string;
}
