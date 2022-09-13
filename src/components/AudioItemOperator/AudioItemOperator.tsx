import React, { useState } from "react";
import styles from "./audioItemOperator.module.less";
import audioIcon from "@src/assets/audio.svg";
import unchooseIcon from "@src/assets/unchoose.svg";
import choosedIcon from "@src/assets/choosed.svg";
import deleteIcon from "@src/assets/delete.svg";
import {
	filenameWithSuffix,
	fileSuffix,
	fileSizeToUnit,
} from "@src/utils/file";
import transIcon from "@src/assets/transform_to.svg";
import { Button } from "antd";
import {
	FolderOpenOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import { AudioInfoObject } from "@src/types/audio";
import { videoTypeArray, audioTypeArray } from "@src/constants/common";
import { showFileExplorer } from "@src/backend_calls/common";

interface Props {
	fileInfo: AudioInfoObject;
	onHandleTargetFormatChange: (
		fileInfo: AudioInfoObject,
		format: string
	) => void;
	onHandleTransformClick: (fileInfo: AudioInfoObject) => void;
	onHandleChoosed: (fileInfo: AudioInfoObject) => void;
	onHandleDelete: (fileInfo: AudioInfoObject) => void;
}

export default function AudioItemOperator({
	fileInfo,
	onHandleTargetFormatChange,
	onHandleTransformClick,
	onHandleChoosed,
	onHandleDelete,
}: Props) {
	const handleChange = (value: string) => {
		console.log(`selected ${value}`);
		onHandleTargetFormatChange(fileInfo, value);
	};
	return (
		<div
			className={styles.audioItemBox}
			style={{
				border: fileInfo.choosed
					? "2px solid rgb(10, 231, 98)"
					: "1px solid rgb(204, 204, 204)",
			}}
		>
			<div className={styles.iconBox}>
				<img src={audioIcon} className={styles.audioIcon} />
			</div>
			<div className={styles.contentBox}>
				<div className={styles.top}>{fileInfo?.name}</div>
				<div className={styles.bottom}>
					<div className={styles.audioInfoBox}>
						<div className={styles.audioInfoItem}>格式: {fileInfo.format}</div>
						<div className={styles.audioInfoItem}>
							比特率: {fileInfo.bitrate}
						</div>
						<div className={styles.audioInfoItem}>
							大小: {fileSizeToUnit(fileInfo.size, "MB")}
						</div>
						<div className={styles.audioInfoItem}>
							时长: {fileInfo.duration}
						</div>
					</div>
					<div className={styles.transIconBox}>
						<img src={transIcon} className={styles.transIcon} />
					</div>
					<div className={styles.audioInfoBox}>
						<div className={styles.audioInfoItem}>
							格式:{" "}
							<select onChange={(e) => handleChange(e.target.value)}>
								{audioTypeArray.map((audio) => {
									return <option value={audio}>{audio}</option>;
								})}
							</select>
						</div>
						<div className={styles.audioInfoItem}>
							分辨率: {fileInfo.bitrate}
						</div>

						<div className={styles.audioInfoItem}>
							时长: {fileInfo.duration}
						</div>
					</div>
					{/* <div className={styles.setBox}>
						<Button type="primary" icon={<EditOutlined />} size="middle">
							设置目标格式
						</Button>
					</div> */}
					<div className={styles.setBox}>
						{fileInfo.successed ? (
							<Button
								type="primary"
								shape="circle"
								icon={<FolderOpenOutlined />}
								size="middle"
								onClick={() =>
									showFileExplorer(fileSuffix(fileInfo.filePath, false))
								}
							></Button>
						) :<Button
							type="default"
							icon={<SyncOutlined />}
							size="middle"
							onClick={() => onHandleTransformClick(fileInfo)}
						>
							转换
						</Button>}
					</div>
				</div>
			</div>
			<div
				className={styles.deleteBox}
				onClick={() => onHandleDelete(fileInfo)}
			>
				<img src={deleteIcon} className={styles.deleteIcon} />
			</div>
			<div
				className={styles.chooseBox}
				onClick={() => onHandleChoosed(fileInfo)}
			>
				{fileInfo.choosed ? (
					<img src={choosedIcon} />
				) : (
					<img src={unchooseIcon} />
				)}
			</div>
		</div>
	);
}
