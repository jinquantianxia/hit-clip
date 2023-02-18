import { useEffect } from "react";
import styles from "./App.module.less";
import { invoke } from "@tauri-apps/api";
import Layout from "./layouts/Index";
import { BrowserRouter } from "react-router-dom";

function App() {
	useEffect(() => {
		invoke("show_main_window");
	}, []);
	return (
		<div className={styles.box}>
			<BrowserRouter>
				<Layout />
			</BrowserRouter>
		</div>
	);
}

export default App;
