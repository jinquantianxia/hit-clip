import React from "react";
import styles from "./MainContent.module.less";
import Navigator from "./MainContent.module.less";
import { Route, Routes } from "react-router-dom";
import VideoTransform from "@src/pages/VideoTransform/VideoTransform";
import AudioTransform from "@src/pages/AudioTransform/AudioTransform";
import VideoCompress from "@src/pages/VideoCompress/VideoCompress";
import VideoToGIF from "@src/pages/VideoToGIF/VideoToGIF";
import AudioExtract from "@src/pages/AudioExtract/AudioExtract";
import KeepAlive from "react-activation";
import { routers } from "@src/routers";

export default function MainContent() {
	return (
		<div className={styles.box}>
			<Routes>
				{routers.map((router) => {
					return (
						<Route
							key={router.path}
							path={router.path}
							element={
								<KeepAlive cacheKey={router.path}>{router.component}</KeepAlive>
							}
						/>
					);
				})}
			</Routes>
		</div>
	);
}
