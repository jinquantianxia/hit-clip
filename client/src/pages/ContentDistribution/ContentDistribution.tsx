import { useState, useEffect } from "react";
import { Menu, Tabs } from "antd";
import type { MenuProps } from "antd";
import {
	AppstoreOutlined,
	MailOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import styles from "./ContentDistribution.module.less";
import { Route, Routes, useNavigate } from "react-router-dom";
import { routers } from "@src/routers";

export default function ContentDistribution() {
	const navigate = useNavigate();
	const [current, setCurrent] = useState("wx");
	useEffect(() => {
		navigate(paths["wx"]);
	}, []);

	const paths: {
		[key: string]: string;
	} = {
		wx: "content_distribute/wx",
		dy: "content_distribute/dy",
		ks: "content_distribute/ks",
	};
	const onClick = (e: any) => {
		// console.log("click ", e);
		setCurrent(e.key);
		// console.log("path:" + e.path);
		navigate(paths[e.key]);
	};
	const items: MenuProps["items"] = [
		{
			label: "微信视频号",
			key: "wx",
			// icon: <MailOutlined />,
		},
		{
			label: "抖音",
			key: "dy",
			// icon: <AppstoreOutlined />,
		},
		{
			label: "快手",
			key: "ks",
			// icon: <SettingOutlined />,
		},
	];

	return (
		<div className={styles.box}>
			<Menu
				onClick={onClick}
				selectedKeys={[current]}
				mode="horizontal"
				items={items}
			/>
			<div className={styles.main}>
				<Routes>
					{routers[4].children!.map((router) => {
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
		</div>
	);
}
