import React, { useState, useEffect } from "react";
import styles from "./CommonBottom.module.less";
import { Spin, message, Button, Modal } from "antd";
import {
	DeleteOutlined,
	PlusSquareOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import { selectFiles, selectDir } from "@src/utils/file";
import { showFileExplorer } from "@src/backend_calls/common";

interface Props {
	showOneKeyButton?: boolean;
	onHandleChangeLocalPath: (path: string) => void;
	onHandleClickOneKeyTransform?: () => void;
}

export default function CommonBottom({
	showOneKeyButton = true,
	onHandleChangeLocalPath = () => {},
	onHandleClickOneKeyTransform = () => {},
}: Props) {
	const [outputDir, setOutputDir] = useState("");
	useEffect(() => {
		const targetPath = localStorage.getItem("target_local_dir");
		if (targetPath) {
			setOutputDir(targetPath);
			onHandleChangeLocalPath(targetPath);
		}
	}, []);
	const handleChangeTargetDir = async () => {
		const dir = await selectDir();
		if (dir) {
			console.log("dir:", dir);
			setOutputDir(dir);
			onHandleChangeLocalPath(dir);
			localStorage.setItem("target_local_dir", dir);
		}
	};
	const handleShowFileExplorer = () => {
		console.log("outputDir:", outputDir);
		showFileExplorer(outputDir);
	};
	return (
		<div className={styles.bottomBox}>
			<div className={styles.outPathTitle}>导出路径</div>
			<div className={styles.outPath}>{outputDir}</div>
			<Button
				type="primary"
				icon={<EditOutlined />}
				onClick={handleChangeTargetDir}
			>
				更改文件夹
			</Button>

			<Button
				type="primary"
				icon={<EditOutlined />}
				onClick={handleShowFileExplorer}
				style={{ marginLeft: "10px" }}
			>
				打开文件夹
			</Button>
			{showOneKeyButton && (
				<div className={styles.transformBox}>
					<Button
						type="primary"
						icon={<SyncOutlined />}
						onClick={onHandleClickOneKeyTransform}
					>
						一键转换
					</Button>
				</div>
			)}
		</div>
	);
}
