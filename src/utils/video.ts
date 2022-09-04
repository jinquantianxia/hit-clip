/**
 * 分辨率转scale
 * @param resolutionStr 1280x720
 */
export function convertResolutionToScale(resolutionStr: string) {
	const arr = resolutionStr.split("x");
	return `scale=${arr[0]}:${arr[1]}`;
	// scale=320:240
}
