import React from "react";
import styles from "./MainContent.module.less";
import { Route, Routes } from "react-router-dom";
import KeepAlive from "react-activation";
import { routers } from "@src/routers";

export default function MainContent() {
	return (
		<div className={styles.box}>
			<Routes>
				{routers[2].children!.map((router) => {
					return (
						<Route
							key={router.path}
							path={router.path}
							element={
								<KeepAlive cacheKey={router.name}>{router.component}</KeepAlive>
							}
						/>
					);
				})}
			</Routes>
		</div>
	);
}
