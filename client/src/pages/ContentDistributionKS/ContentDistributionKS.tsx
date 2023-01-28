import { Typography, Button } from "antd";
import {
	AppstoreOutlined,
	MailOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import styles from "./ContentDistributionKS.module.less";
import ksIcon from "@src/assets/ks.jfif";
import { WebviewWindow } from "@tauri-apps/api/window";
const { Title, Paragraph, Text, Link } = Typography;

export default function ContentDistributionKS() {
	const openNewWindow = () => {
		const webview = new WebviewWindow("ks_window", {
			url: "https://passport.kuaishou.com/pc/account/login",
			maximized: true,
			title: "音遇",
		});
		// since the webview window is created asynchronously,
		// Tauri emits the `tauri://created` and `tauri://error` to notify you of the creation response
		webview.once("tauri://created", function () {
			// webview window successfully created
		});
		webview.once("tauri://error", function (e) {
			// an error happened creating the webview window
		});
	};
	return (
		<div className={styles.box}>
			<div className={styles.logoBox}>
				<img src={ksIcon} />
			</div>
			<div className={styles.content}>
				<Typography>
					<Paragraph>
						快手是一款国民级短视频App。在快手,了解真实的世界,认识有趣的人,也可以记录真实而有趣的自己。快手,拥抱每一种生活。
					</Paragraph>
				</Typography>
			</div>
			<div className={styles.publishBox}>
				<Button type="primary" icon={<MailOutlined />} onClick={openNewWindow}>
					立刻发布
				</Button>
			</div>
		</div>
	);
}
