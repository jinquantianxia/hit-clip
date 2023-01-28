import { useEffect } from "react";
import styles from "./App.module.less";
import { invoke } from "@tauri-apps/api";
import { emit } from "@tauri-apps/api/event";
import { WebviewWindow } from "@tauri-apps/api/window";
import { Route, HashRouter } from "react-router-dom";
import Layout from "./layouts/Index";
import { BrowserRouter } from "react-router-dom";

function App() {
	useEffect(() => {
		// setTimeout(() => {
		// 	invoke("show_main_window");
		// });
	}, []);
	const handleClick = async () => {
		const ret = await invoke("hello_test", { word: "TRURI" });
		alert(ret);
	};

	const handleBackend = async () => {
		emit("backend", { word: "FrontEnd" });
	};

	const handleOpenNewWindow = () => {
		const webview = new WebviewWindow("new-window", {
			url: "https://github.com/tauri-apps/tauri",
		});
		webview.once("tauri://created", function () {
			// webview window successfully created
		});
		webview.once("tauri://error", function (e) {
			// an error happened creating the webview window
		});
	};

	const handleConvertVideoToOtherFormat = async () => {
		const ret = await invoke("convert_video_to_other_format", {
			input: "D:/test/rustProjects/tarui-demo/white.mp4",
			output: "D:/test/rustProjects/tarui-demo/white.mov",
		});
		alert(JSON.stringify(ret));
	};

	const handleConvertVideoToAudio = async () => {
		const ret = await invoke("convert_video_to_audio", {
			input: "D:/test/rustProjects/tarui-demo/test.mp4",
			output: "D:/test/rustProjects/tarui-demo/test_hello.mp3",
		});
		alert(JSON.stringify(ret));
	};
	return (
		<div className={styles.box}>
			<BrowserRouter>
				<Layout />
			</BrowserRouter>
		</div>
	);
}

export default App;
