import dayjs from "dayjs";

export function displayTimeFormat(time: number): string {
	if (!time) return "00:00";
	time = Math.floor(time);
	// let hourStr = '';
	let minuteStr = "";
	let secondStr = "";
	// let hour = time % 3600;
	let minute = Math.floor(time / 60);
	let second = time;
	// if (hour > 0) {
	//     time = time - 3600 * hour
	//     minute = time % 60
	// }
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
	// if (hour > 0) {
	//     if (hour >= 10) {
	//         hourStr = hour + ''
	//     } else {
	//         hourStr = '0' + hour
	//     }
	// }
	if (second > 0) {
		if (second >= 10) {
			secondStr = second + "";
		} else {
			secondStr = "0" + second;
		}
	}
	return `${minuteStr}:${secondStr}`;
}

const charStr = "abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789";
/**
 * 随机生成字符串
 * @param len 指定生成字符串长度
 */
export function getRandomString(len = 8) {
	let min = 0,
		max = charStr.length - 1,
		_str = "";
	//判断是否指定长度，否则默认长度为15
	len = len || 15;
	//循环生成字符串
	for (var i = 0, index; i < len; i++) {
		index = RandomIndex(min, max, i);
		_str += charStr[index];
	}
	return _str;
}

/**
 * 随机生成索引
 * @param min 最小值
 * @param max 最大值
 * @param i 当前获取位置
 */
function RandomIndex(min: number, max: number, i: number) {
	let index = Math.floor(Math.random() * (max - min + 1) + min),
		numStart = charStr.length - 10;
	//如果字符串第一位是数字，则递归重新获取
	if (i == 0 && index >= numStart) {
		index = RandomIndex(min, max, i);
	}
	//返回最终索引值
	return index;
}
