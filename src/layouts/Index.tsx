import React from "react";
import styles from "./index.module.less";
import Navigator from "./Navigator/Navigator";
import MainContent from "./MainContent/MainContent";
import { HashRouter } from "react-router-dom";

export default function Layout() {
	return (
		<div className={styles.box}>
			<HashRouter>
				<div className={styles.naviBox}>
					<Navigator />
				</div>
				<div className={styles.mainBox}>
					<MainContent />
				</div>
			</HashRouter>
		</div>
	);
}
