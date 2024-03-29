import { useState, useEffect } from "react";
import styles from "./MainHeader.module.less";
import minIcon from "@src/assets/min_win.png";
import closeIcon from "@src/assets/close_win.png";
import maxIcon from "@src/assets/max_win.png";
import recoverIcon from "@src/assets/recover_win.png";
import logoIcon from "@src/assets/logo.png";
import homeIcon from "@src/assets/home.png";
import { appWindow } from "@tauri-apps/api/window";
import { useNavigate } from "react-router-dom";

export default function MainHeader() {
	const navigate = useNavigate();
	// useEffect(() => {
	// 	navigate("/main_page");
	// }, []);
	const handleGoHomePage = () => {
		navigate("/");
	};
	const [isMax, setIsMax] = useState(false);
	const handleMinWindown = () => {
		appWindow.minimize();
	};
	const handleMaxWindow = () => {
		setIsMax(!isMax);
		appWindow.toggleMaximize();
	};
	const handleCloseWindow = () => {
		appWindow.close();
	};
	return (
		<div data-tauri-drag-region className={styles.titlebar}>
			<div className={styles.logoBox} data-tauri-drag-region>
				<img src={logoIcon} />
				<div className={styles.logoTxt}>音遇</div>
			</div>
			<div className={styles.menuBox} data-tauri-drag-region>
				<div className={styles.menuItemBox}>
					<img src={homeIcon} onClick={handleGoHomePage} />
				</div>
			</div>
			<div className={styles.operateWindow}>
				<div className={styles.titlebarButton} onClick={handleMinWindown}>
					<img src={minIcon} />
				</div>
				<div className={styles.titlebarButton} onClick={handleMaxWindow}>
					{!isMax ? <img src={maxIcon} /> : <img src={recoverIcon} />}
				</div>
				<div className={styles.titlebarButton} onClick={handleCloseWindow}>
					<img src={closeIcon} />
				</div>
			</div>
		</div>
	);
}
