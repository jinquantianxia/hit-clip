import React from "react";
import styles from "./MainPage.module.less";
import MainHeader from "./MainPage.module.less";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import KeepAlive from "react-activation";

export default function MainPage() {
	const navigate = useNavigate();
	const routers = [
		{
			path: "video_audio",
			name: "音视频处理",
		},
		{
			path: "marerial_square",
			name: "素材广场",
		},
	];
	const handleClickMenu = (path: string) => {
		navigate(path);
	};
	return (
		<div className={styles.box}>
			{routers.map((route) => {
				return (
					<div
						key={route.path}
						className={styles.itemBox}
						onClick={() => handleClickMenu(route.path)}
					>
						{route.name}
					</div>
				);
			})}
		</div>
	);
}
