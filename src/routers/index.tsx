import VideoTransform from "@src/pages/VideoTransform/VideoTransform";
import AudioTransform from "@src/pages/AudioTransform/AudioTransform";
import VideoCompress from "@src/pages/VideoCompress/VideoCompress";
import VideoToGIF from "@src/pages/VideoToGIF/VideoToGIF";
import AudioExtract from "@src/pages/AudioExtract/AudioExtract";

interface Route {
	path: string;
	name: string;
	component: JSX.Element;
}

export const routers: Route[] = [
	{
		path: "/video_transform",
		name: "视频转换",
		component: <VideoTransform />,
	},
	{
		path: "/audio_transform",
		name: "音频转换",
		component: <AudioTransform />,
	},
	{
		path: "/video_compress",
		name: "视频压缩",
		component: <VideoCompress />,
	},
	{
		path: "/video_to_gif",
		name: "视频转GIF",
		component: <VideoToGIF />,
	},
	{
		path: "/audio_extract",
		name: "音频提取",
		component: <AudioExtract />,
	},
];
