import React, { useState } from "react";
import styles from "./VideoAndAudioCombineItem.module.less";
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
	PlusSquareOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import { VideoInfoObject } from "@src/types/video";
import { AudioInfoObject } from "@src/types/audio";
import { videoTypeArray, audioTypeArray } from "@src/constants/common";
import { VideoAndAudioCombineObject } from "@src/types/common";
import { selectFiles, selectDir } from "@src/utils/file";
import { FileTypes } from "@src/types/common";
import { queryVideosInfo, convertVideoToOtherVideoType } from "@src/apis/video";
import { queryAudiosInfo } from "@src/apis/audio";
const { Option } = Select;

interface Props {
	objectInfo: VideoAndAudioCombineObject;
	onHandleChooseVideo?: (
		objectInfo: VideoAndAudioCombineObject,
		videoInfo: VideoInfoObject
	) => void;
	onHandleChooseAudio?: (
		objectInfo: VideoAndAudioCombineObject,
		audioInfo: AudioInfoObject
	) => void;
	onHandleChooseTargetFormat?: (
		objectInfo: VideoAndAudioCombineObject,
		format: string
	) => void;
	onHandleClickTransform?: (objectInfo: VideoAndAudioCombineObject) => void;
	onHandleChoosed?: (fileInfo: VideoAndAudioCombineObject) => void;
	onHandleDelete?: (fileInfo: VideoAndAudioCombineObject) => void;
}

export default function VideoAndAudioCombineItem({
	objectInfo,
	onHandleChooseVideo = () => {},
	onHandleChooseAudio = () => {},
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

	const handleChooseAudio = async () => {
		setLoadingAudio(true);
		const filePaths = (await selectFiles(FileTypes.AUDIO, false)) as string[];
		if (filePaths.length) {
			const files = await queryAudiosInfo(filePaths);
			let file = files[0];
			onHandleChooseAudio(objectInfo, file);
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
					<Button loading={loadingAudio} onClick={handleChooseAudio}>
						{objectInfo.audio ? "更换音频" : "选择音频"}
					</Button>
					<div className={styles.filename}>
						{objectInfo.audio && objectInfo.audio.name}
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
						defaultValue="MP4"
						style={{ width: 120 }}
						onSelect={(value: string) => handleChange(value)}
					>
						{videoTypeArray.map((video) => {
							return (
								<Option key={video} value={video}>
									{video}
								</Option>
							);
						})}
					</Select>
				</div>
			</div>
			<Button
				type="default"
				icon={<SyncOutlined />}
				size="middle"
				onClick={() => onHandleClickTransform(objectInfo)}
			>
				转换
			</Button>
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
