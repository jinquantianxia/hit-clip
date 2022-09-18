import { Typography, Button } from "antd";
import {
	AppstoreOutlined,
	MailOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import styles from "./ContentDistributionDY.module.less";
import dyIcon from "@src/assets/dy.jfif";
import { WebviewWindow } from "@tauri-apps/api/window";
const { Title, Paragraph, Text, Link } = Typography;

export default function ContentDistributionDY() {
	const openNewWindow = () => {
		const webview = new WebviewWindow("dy_window", {
			url: "https://creator.douyin.com",
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
				<img src={dyIcon} />
			</div>
			<div className={styles.content}>
				<Typography>
					<Paragraph>
						抖音是字节跳动孵化的一款音乐创意短视频社交软件，发布作品可同步到今日头条，同步显示。在抖音机会是公平的，每个人都有机会上热门，只要内容优质并且深受大众喜爱，自动推上热门。
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
