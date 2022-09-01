import React from "react";
import styles from "./MainContent.module.less";
import Navigator from "./MainContent.module.less";
import { Route, Routes } from "react-router-dom";
import VideoTransform from "@src/pages/VideoTransform/VideoTransform";
import AudioTransform from "@src/pages/AudioTransform/AudioTransform";
import VideoCompress from "@src/pages/VideoCompress/VideoCompress";
import VideoToGIF from "@src/pages/VideoToGIF/VideoToGIF";
import AudioExtract from "@src/pages/AudioExtract/AudioExtract";

export default function MainContent() {
	return (
		<div className={styles.box}>
			<Routes>
				<Route path="/video_transform" element={<VideoTransform />} />
				<Route path="/audio_transform" element={<AudioTransform />} />
				<Route path="/video_compress" element={<VideoCompress />} />
				<Route path="/video_to_gif" element={<VideoToGIF />} />
				<Route path="/audio_extract" element={<AudioExtract />} />
			</Routes>
		</div>
	);
}
