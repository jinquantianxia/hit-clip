import React from "react";
import styles from "./VideoAndAudioTransform.module.less";
import Navigator from "@src/layouts/Navigator/Navigator";
import MainContent from "@src/layouts/MainContent/MainContent";
import KeepAlive from "react-activation";

export default function VideoAndAudioTransform() {
	return (
		<div className={styles.content}>
			<div className={styles.naviBox}>
				<Navigator />
			</div>
			<div className={styles.mainBox}>
				<MainContent />
			</div>
		</div>
	);
}
