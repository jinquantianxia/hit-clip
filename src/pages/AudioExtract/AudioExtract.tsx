import React, { useState, useMemo } from "react";
import { Spin, message, Button } from "antd";
import {
	DeleteOutlined,
	PlusSquareOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import styles from "./AudioExtract.module.less";
import { selectFiles, selectDir } from "@src/utils/file";
import { queryVideosInfo, convertVideoToAudio } from "@src/apis/video";
import { VideoInfoObject } from "@src/types/video";
import VideoItemOperator from "@src/components/VideoItemOperator/VideoItemOperator";
import { filenameWithSuffix } from "@src/utils/file";
import { convertResolutionToScale } from "@src/utils/video";
import { FileTypes } from "@src/types/common";
import CommonBlankTip from "@src/components/CommonBlankTip/CommonBlankTip";
import CommonBottom from "@src/components/CommonBottom/CommonBottom";

export default function VideoTransform() {
	const [spinning, setSpinning] = useState(false);
	const [filesInfo, setFileInfo] = useState<VideoInfoObject[]>([]);
	const [outputDir, setOutputDir] = useState("");
	const showDeleteSelectedBtn = useMemo(() => {
		const choosedArr = filesInfo.filter((file) => file.choosed);
		if (choosedArr.length) return true;
		return false;
	}, [filesInfo]);
	const handleChooseFile = async () => {
		const videoList = filesInfo.slice();
		const pathList = filesInfo.map((item) => item.filePath);
		const filePaths = (await selectFiles(FileTypes.VIDEO)) as string[];
		if (filePaths.length) {
			setSpinning(true);
			const files = await queryVideosInfo(filePaths, true);
			for (const file of files) {
				if (!pathList.includes(file.filePath)) videoList.push(file);
			}
			setSpinning(false);
			setFileInfo(videoList);
		}
	};

	const handleVideoTargetFormatChange = (
		fileInfo: VideoInfoObject,
		format: string
	) => {
		const fileList = filesInfo.slice();
		const length = fileList.length;
		for (let file of fileList) {
			if (file.filePath === fileInfo.filePath) {
				file.targetFormat = format;
				break;
			}
		}
		console.log("fileList:", fileList);
		setFileInfo(fileList);
	};

	const handleChangeTargetDir = (path: string) => {
		if (path) {
			console.log("dir:", path);
			setOutputDir(path);
		}
	};

	const handleVideoTransformClick = async (
		fileInfo: VideoInfoObject,
		singleMode = true
	) => {
		console.log("fileInfo:", fileInfo);
		if (!outputDir) {
			message.info("您还没有设置输出文件夹！");
			return;
		}
		if (singleMode) setSpinning(true);
		const output_file_path = `${outputDir}\\${filenameWithSuffix(
			fileInfo.filePath,
			false
		)}.${fileInfo.targetFormat?.toLocaleLowerCase()}`;
		console.log("output_file_path:", output_file_path);
		await convertVideoToAudio(fileInfo.filePath, output_file_path);
		const arr = filesInfo.slice();
		for (let item of arr) {
			if (item.filePath === fileInfo.filePath) {
				item.successed = true;
				break;
			}
		}
		setFileInfo(arr);
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
		setSpinning(true);
		await Promise.all(
			filesInfo.map(async (fileInfo) => {
				await handleVideoTransformClick(fileInfo, false);
			})
		);
		setSpinning(false);
		message.success("一键转换成功！");
	};

	const handleChoosedVideo = (fileInfo: VideoInfoObject) => {
		const fileList = filesInfo.slice();
		const len = fileList.length;
		for (let i = 0; i < len; i++) {
			if (fileList[i].filePath === fileInfo.filePath) {
				fileList[i].choosed = !fileList[i].choosed;
				break;
			}
		}
		setFileInfo(fileList);
	};

	const handleDeleteSingleVideo = (fileInfo: VideoInfoObject) => {
		const fileList = filesInfo.slice();
		const len = fileList.length;
		for (let i = 0; i < len; i++) {
			if (fileList[i].filePath === fileInfo.filePath) {
				fileList.splice(i, 1);
				break;
			}
		}
		setFileInfo(fileList);
	};

	const handleDeleteSelectedVideos = () => {
		const unchoosedList = filesInfo.slice().filter((file) => !file.choosed);
		unchoosedList.forEach((item) => (item.choosed = false));
		setFileInfo(unchoosedList);
	};
	return (
		<Spin spinning={spinning}>
			<div className={styles.box}>
				<div className={styles.chooseBox}>
					<div className={styles.chooseBtn}>
						<Button
							type="primary"
							icon={<PlusSquareOutlined />}
							onClick={handleChooseFile}
						>
							添加视频文件
						</Button>
					</div>
					{showDeleteSelectedBtn && (
						<div className={styles.deleteSelectedBox}>
							<Button
								type="primary"
								icon={<DeleteOutlined />}
								danger
								onClick={handleDeleteSelectedVideos}
							>
								删除选中
							</Button>
						</div>
					)}
				</div>
				<div className={styles.videoList}>
					{filesInfo.length > 0 ? (
						filesInfo.map((item) => {
							return (
								<VideoItemOperator
									isToAudio={true}
									fileInfo={item}
									onHandleTargetFormatChange={handleVideoTargetFormatChange}
									onHandleTransformClick={handleVideoTransformClick}
									onHandleDelete={handleDeleteSingleVideo}
								/>
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
