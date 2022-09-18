import { Typography, Button } from "antd";
import {
	AppstoreOutlined,
	MailOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import styles from "./ContentDistributionWX.module.less";
import wxIcon from "@src/assets/wx_video.jfif";
import { WebviewWindow } from "@tauri-apps/api/window";
const { Title, Paragraph, Text, Link } = Typography;

export default function ContentDistributionWX() {
	const openNewWindow = () => {
		const webview = new WebviewWindow("wx_video_window", {
			url: "https://channels.weixin.qq.com/login",
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
				<img src={wxIcon} />
			</div>
			<div className={styles.content}>
				<Typography>
					<Paragraph>
						一个人人都可以记录和创作的内容平台，也是一个了解他人和和认识世界的窗口。
					</Paragraph>
					<Paragraph>
						你创作的内容能通过系统推荐，有机会进入
						<Text strong>超过11亿用户的大舞台</Text>
						。优质原创内容，能快速吸引大量粉丝关注未来与公众号、微信支付和小程序联动，想象空间巨大。
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
