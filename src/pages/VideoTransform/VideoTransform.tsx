import React, { useState } from "react";
import { Button } from "antd";
import {
	PlusSquareOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import styles from "./VideoTransform.module.less";
import Navigator from "./VideoTransform.module.less";
import { HashRouter } from "react-router-dom";
import { selectFile } from "@src/utils/file";
import { queryVideoInfo } from "@src/backend_calls/video";
import { VideoInfoObject } from "@src/types/video";
import videoIcon from "@src/assets/video.svg";
import {
	filenameWithSuffix,
	fileSuffix,
	fileSizeToUnit,
} from "@src/utils/file";
import transIcon from "@src/assets/transform_to.svg";

export default function VideoTransform() {
	const [fileInfo, setFileInfo] = useState<VideoInfoObject>();
	const [localPath, setLocalPath] = useState("");
	const handleChooseFile = async () => {
		const filePath = (await selectFile()) as string;
		setLocalPath(filePath as string);
		const fileInfo = await queryVideoInfo(filePath);
		console.log("fileInfo:", fileInfo);
		setFileInfo(fileInfo);
	};
	return (
		<div className={styles.box}>
			<div className={styles.chooseBox}>
				<div className={styles.chooseBtn}>
					<Button
						type="primary"
						icon={<PlusSquareOutlined />}
						size="middle"
						onClick={handleChooseFile}
					>
						选择文件
					</Button>
				</div>
				<div>{localPath}</div>
			</div>
			<div className={styles.videoList}>
				<div className={styles.videoItemBox}>
					<div className={styles.iconBox}>
						<img src={videoIcon} className={styles.videoIcon} />
					</div>
					<div className={styles.contentBox}>
						<div className={styles.top}>{fileInfo?.name}</div>
						<div className={styles.bottom}>
							<div className={styles.videoInfoBox}>
								<div className={styles.videoInfoItem}>
									格式: {fileInfo?.format}
								</div>
								<div className={styles.videoInfoItem}>
									分辨率: {fileInfo?.resolve}
								</div>
								<div className={styles.videoInfoItem}>
									大小: {fileSizeToUnit(fileInfo?.size as number, "MB")}
								</div>
								<div className={styles.videoInfoItem}>
									时长: {fileInfo?.duration}
								</div>
							</div>
							<div className={styles.transIconBox}>
								<img src={transIcon} className={styles.transIcon} />
							</div>
							<div className={styles.videoInfoBox}>
								<div className={styles.videoInfoItem}>格式: mov</div>
								<div className={styles.videoInfoItem}>
									分辨率: {fileInfo?.resolve}
								</div>
								<div className={styles.videoInfoItem}>
									大小: {fileSizeToUnit(fileInfo?.size as number, "MB")}
								</div>
								<div className={styles.videoInfoItem}>
									时长: {fileInfo?.duration}
								</div>
							</div>
							<div className={styles.setBox}>
								<Button type="primary" icon={<EditOutlined />} size="middle">
									设置目标格式
								</Button>
							</div>
							<Button type="primary" icon={<SyncOutlined />} size="middle">
								转换
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.playBox}>
				{/* <video src={localPath} controls></video> */}
			</div>
		</div>
	);
}
