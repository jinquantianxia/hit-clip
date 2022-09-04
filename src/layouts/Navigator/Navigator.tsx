import React, { useEffect, useState } from "react";
import styles from "./Navigator.module.less";
import { useNavigate } from "react-router-dom";
import { routers } from "@src/routers";

export default function Navigator() {
	const [routerList, setRouterList] = useState(routers);
	const navigate = useNavigate();
	useEffect(() => {
		navigate("/video_transform");
	}, []);
	const handleRouterChange = (index: number, path: string) => {
		const routers = routerList.slice();
		const len = routers.length;
		for (let i = 0; i < len; i++) {
			if (i === index) {
				routers[i].choosed = true;
			} else {
				routers[i].choosed = false;
			}
		}
		setRouterList(routers);
		navigate(path);
	};
	return (
		<div className={styles.box}>
			{routerList.map((router, index) => {
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
			})}
		</div>
	);
}
