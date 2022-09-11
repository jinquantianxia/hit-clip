import {
	AppstoreOutlined,
	MailOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useState, useEffect } from "react";
import styles from "./MaterialSquare.module.less";
import { Route, Routes, useNavigate } from "react-router-dom";
import { routers } from "@src/routers";
import KeepAlive from "react-activation";

export default function MaterialSquare() {
	const navigate = useNavigate();
	const [current, setCurrent] = useState("mail");
	useEffect(() => {
		navigate(routers[2].children![0].path);
	}, []);
	const onClick: MenuProps["onClick"] = (e) => {
		console.log("click ", e);
		setCurrent(e.key);
	};
	const items: MenuProps["items"] = [
		{
			label: "音频素材",
			key: "mail",
			icon: <MailOutlined />,
		},
		// {
		// 	label: "视频素材",
		// 	key: "app",
		// 	icon: <AppstoreOutlined />,
		// },
	];
	return (
		<div className={styles.box}>
			<Menu
				onClick={onClick}
				selectedKeys={[current]}
				mode="horizontal"
				items={items}
			/>
			<div className={styles.content}>
				<Routes>
					{routers[2].children!.map((router) => {
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
