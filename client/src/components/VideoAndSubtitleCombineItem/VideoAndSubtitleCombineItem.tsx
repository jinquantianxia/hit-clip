import React, { useState } from "react";
import styles from "./VideoAndSubtitleCombineItem.module.less";
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
import { Button, Modal, Select, Spin } from "antd";
import {
	FolderOpenOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import { VideoInfoObject } from "@src/types/video";
import { AudioInfoObject } from "@src/types/audio";
import { videoTypeArray, audioTypeArray } from "@src/constants/common";
import { VideoAndSubtitleCombineObject } from "@src/types/common";
import { selectFiles, selectDir } from "@src/utils/file";
import { FileTypes } from "@src/types/common";
import { queryVideosInfo, convertVideoToOtherVideoType } from "@src/apis/video";
import { queryAudiosInfo } from "@src/apis/audio";
import { showFileExplorer } from "@src/backend_calls/common";
const { Option } = Select;

interface Props {
	objectInfo: VideoAndSubtitleCombineObject;
	onHandleChooseVideo?: (
		objectInfo: VideoAndSubtitleCombineObject,
		videoInfo: VideoInfoObject
	) => void;
	onHandleChooseSubtitle?: (
		objectInfo: VideoAndSubtitleCombineObject,
		subtitle: string
	) => void;
	onHandleChooseTargetFormat?: (
		objectInfo: VideoAndSubtitleCombineObject,
		format: string
	) => void;
	onHandleClickTransform?: (objectInfo: VideoAndSubtitleCombineObject) => void;
	onHandleChoosed?: (fileInfo: VideoAndSubtitleCombineObject) => void;
	onHandleDelete?: (fileInfo: VideoAndSubtitleCombineObject) => void;
}

export default function VideoAndSubtitleCombineItem({
	objectInfo,
	onHandleChooseVideo = () => {},
	onHandleChooseSubtitle = () => {},
	onHandleChooseTargetFormat = () => {},
	onHandleClickTransform = () => {},
	onHandleChoosed = () => {},
	onHandleDelete = () => {},
}: Props) {
	const [loadingVideo, setLoadingVideo] = useState(false);
	const [loadingAudio, setLoadingAudio] = useState(false);
	const handleChange = (value: string) => {
		console.log(`selected ${value}`);
		onHandleChooseTargetFormat(objectInfo, value);
	};

	const handleChooseVideo = async () => {
		setLoadingVideo(true);
		const filePaths = (await selectFiles(FileTypes.VIDEO, false)) as string[];
		if (filePaths.length) {
			const files = await queryVideosInfo(filePaths);
			let file = files[0];
			onHandleChooseVideo(objectInfo, file);
		}
		setLoadingVideo(false);
	};

	const handleChooseSubtitle = async () => {
		setLoadingAudio(true);
		const filePaths = (await selectFiles(
			FileTypes.SUBTITLE,
			false
		)) as string[];
		if (filePaths.length) {
			onHandleChooseSubtitle(objectInfo, filePaths[0]);
		}
		setLoadingAudio(false);
	};
	return (
		<div
			className={styles.box}
			style={{
				border: objectInfo.choosed
					? "2px solid rgb(10, 231, 98)"
					: "1px solid rgb(204, 204, 204)",
			}}
		>
			<div className={styles.inputBox}>
				<div className={styles.inputVideoBox}>
					<Button loading={loadingVideo} onClick={handleChooseVideo}>
						{objectInfo.video ? "更换视频" : "选择视频"}
					</Button>
					<div className={styles.filename}>
						{objectInfo.video && objectInfo.video.name}
					</div>
				</div>
				<div className={styles.inputAudioBox}>
					<Button loading={loadingAudio} onClick={handleChooseSubtitle}>
						{objectInfo.subtitle ? "更换字幕" : "选择字幕"}
					</Button>
					<div className={styles.filename}>
						{objectInfo.subtitle && filenameWithSuffix(objectInfo.subtitle)}
					</div>
				</div>
			</div>
			<div className={styles.transBox}>
				<img src={transIcon} />
			</div>
			<div className={styles.outputBox}>
				<div className={styles.outputTxt}>目标视频格式</div>
				<div className={styles.chooseType}>
					<Select
						defaultValue="MKV"
						style={{ width: 120 }}
						disabled
						// onSelect={(value: string) => handleChange(value)}
					>
						{/* {videoTypeArray.map((video) => {
							return (
								<Option key={video} value={video}>
									{video}
								</Option>
							);
						})} */}
					</Select>
				</div>
			</div>
			{objectInfo.successed ? (
				<Button
					type="primary"
					shape="circle"
					icon={<FolderOpenOutlined />}
					size="middle"
					onClick={() =>
						showFileExplorer(fileSuffix(objectInfo?.targetPath!, false))
					}
				></Button>
			) : (
				<Button
					type="default"
					icon={<SyncOutlined />}
					size="middle"
					onClick={() => onHandleClickTransform(objectInfo)}
				>
					转换
				</Button>
			)}
			<div
				className={styles.deleteBox}
				onClick={() => onHandleDelete(objectInfo)}
			>
				<img src={deleteIcon} className={styles.deleteIcon} />
			</div>
			<div
				className={styles.chooseBox}
				onClick={() => onHandleChoosed(objectInfo)}
			>
				{objectInfo.choosed ? (
					<img src={choosedIcon} />
				) : (
					<img src={unchooseIcon} />
				)}
			</div>
		</div>
	);
}
