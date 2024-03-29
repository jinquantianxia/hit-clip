import React, { useState } from "react";
import styles from "./VideoItemOperator.module.less";
import videoIcon from "@src/assets/video.svg";
import unchooseIcon from "@src/assets/unchoose.svg";
import choosedIcon from "@src/assets/choosed.svg";
import deleteIcon from "@src/assets/delete.svg";
import {
	filenameWithSuffix,
	fileSuffix,
	fileSizeToUnit,
} from "@src/utils/file";
import transIcon from "@src/assets/transform_to.svg";
import { Button, Modal } from "antd";
import {
	FolderOpenOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import { VideoInfoObject } from "@src/types/video";
import {
	videoTypeArray,
	audioTypeArray,
	videoSpeedArray,
} from "@src/constants/common";
import { showFileExplorer } from "@src/backend_calls/common";

interface Props {
	fileInfo: VideoInfoObject;
	isToAudio?: boolean;
	canModifyResolution?: boolean;
	canModifyType?: boolean;
	showTargetDurations?: boolean;
	showChangeSpeed?: boolean;
	onHandleTargetFormatChange?: (
		fileInfo: VideoInfoObject,
		format: string
	) => void;
	onHandleTransformClick?: (fileInfo: VideoInfoObject) => void;
	onHandleDelete: (fileInfo: VideoInfoObject) => void;
	onHandleChangeTargetResolution?: (fileInfo: VideoInfoObject) => void;
	onHandleChangeSpeed?: (fileInfo: VideoInfoObject, speed: string) => void;
}

export default function VideoItemOperator({
	fileInfo,
	isToAudio = false,
	canModifyResolution = false,
	canModifyType = true,
	showTargetDurations = true,
	showChangeSpeed = false,
	onHandleTargetFormatChange = () => {},
	onHandleTransformClick = () => {},
	onHandleDelete,
	onHandleChangeTargetResolution = () => {},
	onHandleChangeSpeed = () => {},
}: Props) {
	const handleChange = (value: string) => {
		console.log(`selected ${value}`);
		onHandleTargetFormatChange(fileInfo, value);
	};

	const handleChangeSpeed = (value: string) => {
		console.log(`selected ${value}`);
		onHandleChangeSpeed(fileInfo, value);
	};

	return (
		<div
			className={styles.videoItemBox}
			style={{
				border: fileInfo.choosed
					? "2px solid rgb(10, 231, 98)"
					: "1px solid rgb(204, 204, 204)",
			}}
		>
			<div className={styles.iconBox}>
				<img src={videoIcon} className={styles.videoIcon} />
			</div>
			<div className={styles.contentBox}>
				<div className={styles.top}>{fileInfo?.name}</div>
				<div className={styles.bottom}>
					<div className={styles.videoInfoBox}>
						<div className={styles.videoInfoItem}>格式: {fileInfo.format}</div>
						<div className={styles.videoInfoItem}>
							分辨率: {fileInfo.originResolution}
						</div>
						<div className={styles.videoInfoItem}>
							大小: {fileSizeToUnit(fileInfo.size, "MB")}
						</div>
						<div className={styles.videoInfoItem}>
							时长: {fileInfo.duration}
						</div>
					</div>
					<div className={styles.transIconBox}>
						<img src={transIcon} className={styles.transIcon} />
					</div>
					<div className={styles.videoInfoBox}>
						{canModifyType ? (
							<div className={styles.videoInfoItem}>
								格式:{" "}
								<select onChange={(e) => handleChange(e.target.value)}>
									{isToAudio
										? audioTypeArray.map((video) => {
												return (
													<option key={video} value={video}>
														{video}
													</option>
												);
										  })
										: videoTypeArray.map((video) => {
												return (
													<option key={video} value={video}>
														{video}
													</option>
												);
										  })}
								</select>
							</div>
						) : (
							<div className={styles.videoInfoItem}>
								格式: {fileInfo.format}
							</div>
						)}
						{isToAudio ? (
							<div className={styles.videoInfoItem}></div>
						) : canModifyResolution ? (
							<div className={styles.videoInfoItem}>
								分辨率:{" "}
								<Button
									danger
									style={{ height: "22px", fontSize: "12px" }}
									onClick={() => onHandleChangeTargetResolution(fileInfo)}
								>
									{fileInfo.resolution}
								</Button>
							</div>
						) : (
							<div className={styles.videoInfoItem}>
								分辨率: {fileInfo.resolution}
							</div>
						)}

						{showTargetDurations && (
							<div className={styles.videoInfoItem}>
								时长: {fileInfo.duration}
							</div>
						)}
						{showChangeSpeed && (
							<div className={styles.videoInfoItem}>
								速率:{" "}
								<select onChange={(e) => handleChangeSpeed(e.target.value)}>
									{videoSpeedArray.map((video) => {
										return (
											<option key={video} value={video}>
												{video}
											</option>
										);
									})}
								</select>
							</div>
						)}
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
						) : (
							<Button
								type="default"
								icon={<SyncOutlined />}
								size="middle"
								onClick={() => onHandleTransformClick(fileInfo)}
							>
								转换
							</Button>
						)}
					</div>
				</div>
			</div>
			<div
				className={styles.deleteBox}
				onClick={() => onHandleDelete(fileInfo)}
			>
				<img src={deleteIcon} className={styles.deleteIcon} />
			</div>
			{/* <div
				className={styles.chooseBox}
				onClick={() => onHandleChoosed(fileInfo)}
			>
				{fileInfo.choosed ? (
					<img src={choosedIcon} />
				) : (
					<img src={unchooseIcon} />
				)}
			</div> */}
		</div>
	);
}
