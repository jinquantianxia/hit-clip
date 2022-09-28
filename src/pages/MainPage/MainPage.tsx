import React from "react";
import styles from "./MainPage.module.less";
import MainHeader from "./MainPage.module.less";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import KeepAlive from "react-activation";
import { routers } from "@src/routers";

export default function MainPage() {
	const navigate = useNavigate();
	const handleClickMenu = (path: string) => {
		navigate(path);
	};
	return (
		<div className={styles.box}>
			{routers.slice(1).map((route) => {
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
