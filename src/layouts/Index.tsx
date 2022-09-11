import React from "react";
import styles from "./index.module.less";
import MainHeader from "./MainHeader/MainHeader";
import { Route, Routes } from "react-router-dom";

import KeepAlive from "react-activation";
import { routers } from "@src/routers";

export default function Layout() {
	return (
		<div className={styles.box}>
			<div className={styles.header}>
				<MainHeader />
			</div>
			<Routes>
				{routers.map((router) => {
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
