import React, { useState, useMemo } from "react";
import { Spin, message, Button } from "antd";
import {
	DeleteOutlined,
	PlusSquareOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import styles from "./CombineVideoAndSubtitle.module.less";
import { selectFiles, selectDir } from "@src/utils/file";
import { combineVideoSubtitle } from "@src/apis/video";
import { VideoAndSubtitleCombineObject } from "@src/types/common";
import VideoAndSubtitleCombineItem from "@src/components/VideoAndSubtitleCombineItem/VideoAndSubtitleCombineItem";
import { filenameWithSuffix } from "@src/utils/file";
import { FileTypes } from "@src/types/common";
import CommonBlankTip from "@src/components/CommonBlankTip/CommonBlankTip";
import { VideoInfoObject } from "@src/types/video";
import { AudioInfoObject } from "@src/types/audio";
import { getRandomString } from "@src/utils/common";
import CommonBottom from "@src/components/CommonBottom/CommonBottom";

export default function CombineVideoAndSubtitle() {
	const [spinning, setSpinning] = useState(false);
	const [filesInfo, setFilesInfo] = useState<VideoAndSubtitleCombineObject[]>([
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
			targetFormat: "MKV",
		};
		arr.push(item);
		setFilesInfo(arr);
	};

	const handleChooseTargetFormat = (
		fileInfo: VideoAndSubtitleCombineObject,
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
		fileInfo: VideoAndSubtitleCombineObject,
		singleMode = true
	) => {
		console.log("fileInfo:", fileInfo);
		if (!outputDir) {
			message.info("您还没有设置输出文件夹！");
			return;
		}
		if (!fileInfo.subtitle) {
			message.info("您还没有选择视频文件！");
			return;
		}
		if (!fileInfo.video) {
			message.info("您还没有选择视频文件！");
			return;
		}
		if (singleMode) setSpinning(true);
		const output_file_path = `${outputDir}\\${filenameWithSuffix(
			fileInfo.subtitle!,
			false
		)}_combine_${filenameWithSuffix(
			fileInfo.video?.filePath!,
			false
		)}.${fileInfo.targetFormat?.toLocaleLowerCase()}`;
		console.log("output_file_path:", output_file_path);
		await combineVideoSubtitle(
			fileInfo.video?.filePath!,
			output_file_path,
			fileInfo.subtitle!
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
			if (!item.subtitle || !item.video) {
				message.info("您还有未设置的字幕或视频，无法一键转换");
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

	const handleChoosedItem = (fileInfo: VideoAndSubtitleCombineObject) => {
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

	const handleDeleteSingleItem = (fileInfo: VideoAndSubtitleCombineObject) => {
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
		objectInfo: VideoAndSubtitleCombineObject,
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
	const handleChooseSubtitle = (
		objectInfo: VideoAndSubtitleCombineObject,
		subtitle: string
	) => {
		const arr = filesInfo.slice();
		for (let item of arr) {
			if (item.key === objectInfo.key) {
				item.subtitle = subtitle;
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
							添加视频字幕混合
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
								<VideoAndSubtitleCombineItem
									objectInfo={item}
									onHandleChooseVideo={handleChooseVideo}
									onHandleChooseSubtitle={handleChooseSubtitle}
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
