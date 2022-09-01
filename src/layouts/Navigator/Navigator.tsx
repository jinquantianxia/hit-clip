import React, { useEffect } from "react";
import styles from "./Navigator.module.less";
import { useNavigate } from "react-router-dom";
import { routers } from "@src/routers";

export default function Navigator() {
	const navigate = useNavigate();
	useEffect(() => {
		navigate("/video_transform");
	}, []);
	const handleRouterChange = (path: string) => {
		navigate(path);
	};
	return (
		<div className={styles.box}>
			{routers.map((router) => {
				return (
					<div
						className={styles.item}
						onClick={() => handleRouterChange(router.path)}
					>
						{router.name}
					</div>
				);
			})}
		</div>
	);
}
