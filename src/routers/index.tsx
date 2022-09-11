import VideoTransform from "@src/pages/VideoTransform/VideoTransform";
import AudioTransform from "@src/pages/AudioTransform/AudioTransform";
import VideoCompress from "@src/pages/VideoCompress/VideoCompress";
import VideoToGIF from "@src/pages/VideoToGIF/VideoToGIF";
import AudioExtract from "@src/pages/AudioExtract/AudioExtract";
import VideoMute from "@src/pages/VideoMute/VideoMute";

interface Route {
	path: string;
	name: string;
	component: JSX.Element;
	icon?: JSX.Element;
	choosed?: boolean;
	children?: Route[];
}
import {
	AppstoreOutlined,
	CalendarOutlined,
	LinkOutlined,
	MailOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import KeepAlive from "react-activation";
import VideoAndAudioTransform from "@src/pages/VideoAndAudioTransform/VideoAndAudioTransform";
import MainPage from "@src/pages/MainPage/MainPage";
import MaterialSquare from "@src/pages/MaterialSquare/MaterialSquare";
import AudioMaterialSquare from "@src/pages/AudioMaterialSquare/AudioMaterialSquare";
import CombineVideoAndAudio from "@src/pages/CombineVideoAndAudio/CombineVideoAndAudio";

export const routers: Route[] = [
	{
		path: "/",
		name: "首页",
		component: <MainPage />,
	},
	{
		path: "/video_audio/*",
		name: "视频转换",
		component: <VideoAndAudioTransform />,
		children: [
			{
				path: "video_audio/video_transform",
				name: "视频转换",
				component: <VideoTransform />,
				icon: <AppstoreOutlined />,
				choosed: true,
			},
			{
				path: "video_audio/video_mute",
				name: "视频去声",
				component: <VideoMute />,
				icon: <MailOutlined />,
				choosed: false,
			},
			{
				path: "video_audio/combine_audio",
				name: "音视频混合",
				component: <CombineVideoAndAudio />,
				icon: <MailOutlined />,
				choosed: false,
			},
			{
				path: "video_audio/audio_transform",
				name: "音频转换",
				component: <AudioTransform />,
				icon: <CalendarOutlined />,
				choosed: false,
			},

			// {
			// 	path: "/video_compress",
			// 	name: "视频压缩",
			// 	component: <VideoCompress />,
			// 	choosed: false,
			// },
			// {
			// 	path: "/video_to_gif",
			// 	name: "视频转GIF",
			// 	component: <VideoToGIF />,
			// 	choosed: false,
			// },
			{
				path: "video_audio/audio_extract",
				name: "音频提取",
				component: <AudioExtract />,
				icon: <LinkOutlined />,
				choosed: false,
			},
		],
	},
	{
		path: "/marerial_square/*",
		name: "素材广场",
		component: <MaterialSquare />,
		children: [
			{
				path: "marerial_square/audios",
				name: "音频广场",
				component: <AudioMaterialSquare />,
			},
		],
	},
];
