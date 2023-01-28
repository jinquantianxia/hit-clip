export interface VideoInfoObject {
	id: number;
	name: string;
	filePath: string;
	format: string;
	originResolution: string;
	resolution: string; // 分辨率
	size: number;
	duration: string;
	choosed: boolean;
	successed: boolean;
	targetFormat?: string;
	targetSpeed?: string;
}
