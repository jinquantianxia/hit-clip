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
	PlusSquareOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import { VideoInfoObject } from "@src/types/video";
import { videoTypeArray, audioTypeArray } from "@src/constants/common";

interface Props {
	fileInfo: VideoInfoObject;
	isToAudio?: boolean;
	canModifyResolution?: boolean;
	onHandleTargetFormatChange: (
		fileInfo: VideoInfoObject,
		format: string
	) => void;
	onHandleTransformClick: (fileInfo: VideoInfoObject) => void;
	onHandleChoosed: (fileInfo: VideoInfoObject) => void;
	onHandleDelete: (fileInfo: VideoInfoObject) => void;
	onHandleChangeTargetResolution?: (fileInfo: VideoInfoObject) => void;
}

export default function VideoItemOperator({
	fileInfo,
	isToAudio = false,
	canModifyResolution = false,
	onHandleTargetFormatChange,
	onHandleTransformClick,
	onHandleChoosed,
	onHandleDelete,
	onHandleChangeTargetResolution = () => {},
}: Props) {
	const handleChange = (value: string) => {
		console.log(`selected ${value}`);
		onHandleTargetFormatChange(fileInfo, value);
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

						<div className={styles.videoInfoItem}>
							时长: {fileInfo.duration}
						</div>
					</div>
					{/* <div className={styles.setBox}>
						<Button type="primary" icon={<EditOutlined />} size="middle">
							设置目标格式
						</Button>
					</div> */}
					<div className={styles.setBox}>
						<Button
							type="default"
							icon={<SyncOutlined />}
							size="middle"
							onClick={() => onHandleTransformClick(fileInfo)}
						>
							转换
						</Button>
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
