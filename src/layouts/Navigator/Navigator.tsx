import React, { useEffect, useState } from "react";
import {
	AppstoreOutlined,
	CalendarOutlined,
	LinkOutlined,
	MailOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import styles from "./Navigator.module.less";
import { useNavigate } from "react-router-dom";
import { routers } from "@src/routers";
import { Menu } from "antd";
import type { MenuProps, MenuTheme } from "antd/es/menu";
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
	label: React.ReactNode,
	key?: React.Key | null,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
	} as MenuItem;
}
export default function Navigator() {
	const navigate = useNavigate();
	useEffect(() => {
		navigate("video_audio/video_transform");
	}, []);
	const items: MenuItem[] = routers[1].children!.map((item, index) =>
		getItem(item.name, index, item.icon)
	);

	const handleRouterChange = (e: any) => {
		const key = Number(e.key);
		navigate(routers[1].children![key].path);
	};
	return (
		<div className={styles.box}>
			<Menu
				style={{ width: 200 }}
				defaultSelectedKeys={["0"]}
				defaultOpenKeys={["sub1"]}
				mode="vertical"
				theme="light"
				items={items}
				onSelect={(e) => handleRouterChange(e)}
			/>
			{/* {routerList.map((router, index) => {
				return (
					<div
						key={router.path}
						className={styles.item}
						style={{
							backgroundColor: router.choosed ? "rgb(255, 229, 194)" : "#fff",
						}}
						onClick={() => handleRouterChange(index, router.path)}
					>
						{router.name}
					</div>
				);
			})} */}
		</div>
	);
}
