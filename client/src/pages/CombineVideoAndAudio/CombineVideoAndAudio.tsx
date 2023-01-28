import React, { useState, useMemo } from "react";
import { Spin, message, Button } from "antd";
import {
	DeleteOutlined,
	PlusSquareOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import styles from "./CombineVideoAndAudio.module.less";
import { selectFiles, selectDir } from "@src/utils/file";
import { combineVideoAndAudio } from "@src/apis/video";
import { VideoAndAudioCombineObject } from "@src/types/common";
import VideoAndAudioCombineItem from "@src/components/VideoAndAudioCombineItem/VideoAndAudioCombineItem";
import { filenameWithSuffix } from "@src/utils/file";
import { FileTypes } from "@src/types/common";
import CommonBlankTip from "@src/components/CommonBlankTip/CommonBlankTip";
import { VideoInfoObject } from "@src/types/video";
import { AudioInfoObject } from "@src/types/audio";
import { getRandomString } from "@src/utils/common";
import CommonBottom from "@src/components/CommonBottom/CommonBottom";

export default function AudioTransform() {
	const [spinning, setSpinning] = useState(false);
	const [filesInfo, setFilesInfo] = useState<VideoAndAudioCombineObject[]>([
		{
			key: getRandomString(),
			choosed: false,
			successed: false,
			targetFormat: "MP4",
		},
	]);
	const [outputDir, setOutputDir] = useState("");
	const showDeleteSelectedBtn = useMemo(() => {
		const choosedArr = filesInfo.filter((file) => file.choosed);
		if (choosedArr.length) return true;
		return false;
	}, [filesInfo]);
	const handleAddItem = () => {
		const arr = filesInfo.slice();
		const item = {
			key: getRandomString(),
			choosed: false,
			successed: false,
			targetFormat: "MP4",
		};
		arr.push(item);
		setFilesInfo(arr);
	};

	const handleChooseTargetFormat = (
		fileInfo: VideoAndAudioCombineObject,
		format: string
	) => {
		const fileList = filesInfo.slice();
		for (let file of fileList) {
			if (file.key === fileInfo.key) {
				file.targetFormat = format;
				break;
			}
		}
		console.log("fileList:", fileList);
		setFilesInfo(fileList);
	};

	const handleChangeTargetDir = (path: string) => {
		if (path) {
			console.log("dir:", path);
			setOutputDir(path);
		}
	};

	const handleClickTransform = async (
		fileInfo: VideoAndAudioCombineObject,
		singleMode = true
	) => {
		console.log("fileInfo:", fileInfo);
		if (!outputDir) {
			message.info("您还没有设置输出文件夹！");
			return;
		}
		if (!fileInfo.video) {
			message.info("您还没有选择视频文件！");
			return;
		}
		if (!fileInfo.audio) {
			message.info("您还没有选择音频文件！");
			return;
		}
		if (singleMode) setSpinning(true);
		const output_file_path = `${outputDir}\\${filenameWithSuffix(
			fileInfo.video?.filePath!,
			false
		)}_combine_${filenameWithSuffix(
			fileInfo.audio?.filePath!,
			false
		)}.${fileInfo.targetFormat?.toLocaleLowerCase()}`;
		console.log("output_file_path:", output_file_path);
		await combineVideoAndAudio(
			fileInfo.video?.filePath!,
			fileInfo.audio?.filePath!,
			output_file_path
		);
		const arr = filesInfo.slice();
		for (let item of arr) {
			if (item.key === fileInfo.key) {
				item.successed = true;
				item.targetPath = output_file_path;
				break;
			}
		}
		setFilesInfo(arr);
		if (singleMode) {
			setSpinning(false);
			message.success("转换成功！");
		}
	};

	const handleTransformOneClick = async () => {
		if (!outputDir) {
			message.info("您还没有设置输出文件夹！");
			return;
		}
		for (const item of filesInfo) {
			if (!item.video || !item.audio) {
				message.info("您还有未设置的音频或视频，无法一键转换");
				return;
			}
		}
		setSpinning(true);
		await Promise.all(
			filesInfo.map(async (fileInfo) => {
				await handleClickTransform(fileInfo, false);
			})
		);
		setSpinning(false);
		message.success("一键转换成功！");
	};

	const handleChoosedItem = (fileInfo: VideoAndAudioCombineObject) => {
		const fileList = filesInfo.slice();
		const len = fileList.length;
		for (let i = 0; i < len; i++) {
			if (fileList[i].key === fileInfo.key) {
				fileList[i].choosed = !fileList[i].choosed;
				break;
			}
		}
		setFilesInfo(fileList);
	};

	const handleDeleteSingleItem = (fileInfo: VideoAndAudioCombineObject) => {
		const fileList = filesInfo.slice();
		const len = fileList.length;
		for (let i = 0; i < len; i++) {
			if (fileList[i].key === fileInfo.key) {
				fileList.splice(i, 1);
				break;
			}
		}
		setFilesInfo(fileList);
	};

	const handleDeleteSelectedAudios = () => {
		const unchoosedList = filesInfo.slice().filter((file) => !file.choosed);
		unchoosedList.forEach((item) => (item.choosed = false));
		setFilesInfo(unchoosedList);
	};

	const handleChooseVideo = (
		objectInfo: VideoAndAudioCombineObject,
		videoInfo: VideoInfoObject
	) => {
		const arr = filesInfo.slice();
		for (let item of arr) {
			if (item.key === objectInfo.key) {
				item.video = videoInfo;
				break;
			}
		}
		setFilesInfo(arr);
	};
	const handleChooseAudio = (
		objectInfo: VideoAndAudioCombineObject,
		audioInfo: AudioInfoObject
	) => {
		const arr = filesInfo.slice();
		for (let item of arr) {
			if (item.key === objectInfo.key) {
				item.audio = audioInfo;
				break;
			}
		}
		setFilesInfo(arr);
	};
	return (
		<Spin spinning={spinning}>
			<div className={styles.box}>
				<div className={styles.chooseBox}>
					<div className={styles.chooseBtn}>
						<Button
							type="primary"
							icon={<PlusSquareOutlined />}
							onClick={handleAddItem}
						>
							添加音视频混合
						</Button>
					</div>
					{showDeleteSelectedBtn && (
						<div className={styles.deleteSelectedBox}>
							<Button
								type="primary"
								icon={<DeleteOutlined />}
								danger
								onClick={handleDeleteSelectedAudios}
							>
								删除选中
							</Button>
						</div>
					)}
				</div>
				<div className={styles.audioList}>
					{filesInfo.length > 0 ? (
						filesInfo.map((item) => {
							return (
								<VideoAndAudioCombineItem
									objectInfo={item}
									onHandleChooseVideo={handleChooseVideo}
									onHandleChooseAudio={handleChooseAudio}
									onHandleChooseTargetFormat={handleChooseTargetFormat}
									onHandleChoosed={handleChoosedItem}
									onHandleClickTransform={handleClickTransform}
									onHandleDelete={handleDeleteSingleItem}
								/>
								// <AudioItemOperator
								// 	fileInfo={item}
								// 	onHandleTargetFormatChange={handleAudioTargetFormatChange}
								// 	onHandleTransformClick={handleAudioTransformClick}
								// 	onHandleChoosed={handleChoosedAudio}
								// 	onHandleDelete={handleDeleteSingleAudio}
								// />
							);
						})
					) : (
						<CommonBlankTip />
					)}
				</div>
				<CommonBottom
					onHandleChangeLocalPath={handleChangeTargetDir}
					onHandleClickOneKeyTransform={handleTransformOneClick}
				/>
			</div>
		</Spin>
	);
}
