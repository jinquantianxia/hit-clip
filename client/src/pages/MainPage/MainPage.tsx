import React from "react";
import styles from "./MainPage.module.less";
import MainHeader from "./MainPage.module.less";
import { useNavigate } from "react-router-dom";
import { routers } from "@src/routers";
import { Route } from "@src/routers";

export default function MainPage() {
	const navigate = useNavigate();
	const handleClickMenu = (path: string) => {
		navigate(path);
	};
	const handleMenuClick = (route: Route) => {
		if (!route.active) return;
		handleClickMenu(route.path);
	};
	return (
		<div className={styles.box}>
			{routers.slice(1).map((route) => {
				return (
					<div
						key={route.path}
						className={styles.itemBox}
						onClick={() => handleMenuClick(route)}
						style={{
							backgroundColor: !route.active ? "grey" : "rgb(4, 162, 109)",
						}}
					>
						{route.name}
					</div>
				);
			})}
		</div>
	);
}
