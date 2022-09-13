/**
 * 分辨率转scale
 * @param resolutionStr 1280x720
 */
export function convertResolutionToScale(resolutionStr: string) {
	const arr = resolutionStr.split("x");
	return `scale=${arr[0]}:${arr[1]}`;
	// scale=320:240
}

export function displayVideoTimeFormat(time: number): string {
	if (!time) return "00:00:00";
	time = Math.floor(time);
	let hourStr = "";
	let minuteStr = "";
	let secondStr = "";
	let hour = Math.floor(time / 3600);
	let minute = Math.floor(time / 60);
	let second = time;
	if (hour > 0) {
		time = time - 3600 * hour;
		minute = time % 60;
		if (hour >= 10) {
			hourStr = hour + "";
		} else {
			hourStr = "0" + hour;
		}
	} else {
		hourStr = "00";
	}
	if (minute > 0) {
		time = time - 60 * minute;
		second = time;
		if (minute >= 10) {
			minuteStr = minute + "";
		} else if (minute > 0 && minute < 10) {
			minuteStr = "0" + minute;
		}
	} else {
		minuteStr = "00";
	}

	if (second > 0) {
		if (second >= 10) {
			secondStr = second + "";
		} else {
			secondStr = "0" + second;
		}
	}
	return `${hourStr}:${minuteStr}:${secondStr}`;
}
