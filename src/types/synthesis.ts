export interface CommonSynthsisObject {
	input_file_name: string;
	output_file_name: string;
	service_name: string; //  ("google" or "g", "amazon" or "a", "baidu" or "b", "ibm" or "i", "microsoft" or "m", "naver" or "n", "youdao" or "y"). The default is "google".
	language_name: string; // For example: en-US, de-DE, ru-RU. The default is "en-US".
	gender: string;
	voice_name: string; // For Google TTS and Microsoft Azure the rate values range from "0.1" to "3.0".For Naver TTS the rate values range from "0.5" to "1.5".
	speech_rate: string; //  The default is "1.0"
	volume: string; // 0 to 200 (the default is 100)
}

export interface LanguageList {
	[key: string]: {
		female: {
			[key: string]: string;
		};
		male: {
			[key: string]: string;
		};
	};
}

export const languageList: LanguageList = {
	中文: {
		female: {
			温柔女声: "Li Na",
			标准女声: "Zhang Jing",
		},
		male: {
			标准男声: "Wang Wei",
		},
	},
	美式英语: {
		female: {
			Allison: "Allison",
			Emily: "Emily",
			Lisa: "Lisa",
			Olivia: "Olivia",
		},
		male: { Henry: "Henry", Kevin: "Kevin", Michael: "Michael" },
	},
	英式英语: {
		female: { Charlotte: "Charlotte", Kate: "Kate" },
		male: { James: "James" },
	},
};
