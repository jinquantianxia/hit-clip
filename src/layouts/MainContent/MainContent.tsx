import React from "react";
import styles from "./MainContent.module.less";
import { Route, Routes } from "react-router-dom";
import KeepAlive from "react-activation";
import { routers } from "@src/routers";

export default function MainContent() {
	return (
		<div className={styles.box}>
			<Routes>
				{routers[1].children!.map((router) => {
					return (
						<Route
							key={router.path}
							path={router.path}
							element={router.component}
						/>
					);
				})}
			</Routes>
		</div>
	);
}
