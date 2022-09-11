import React, { useState, useMemo } from "react";
import { Spin, message, Button } from "antd";
import {
	DeleteOutlined,
	PlusSquareOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import styles from "./AudioTransform.module.less";
import { selectFiles, selectDir } from "@src/utils/file";
import { queryAudiosInfo, convertAudioToOtherAudioType } from "@src/apis/audio";
import { AudioInfoObject } from "@src/types/audio";
import AudioItemOperator from "@src/components/AudioItemOperator/AudioItemOperator";
import { filenameWithSuffix } from "@src/utils/file";
import { FileTypes } from "@src/types/common";
import CommonBlankTip from "@src/components/CommonBlankTip/CommonBlankTip";

export default function AudioTransform() {
	const [spinning, setSpinning] = useState(false);
	const [filesInfo, setFileInfo] = useState<AudioInfoObject[]>([]);
	const [outputDir, setOutputDir] = useState("");
	const showDeleteSelectedBtn = useMemo(() => {
		const choosedArr = filesInfo.filter((file) => file.choosed);
		if (choosedArr.length) return true;
		return false;
	}, [filesInfo]);
	const handleChooseFile = async () => {
		setSpinning(true);
		const AudioList = filesInfo.slice();
		const pathList = filesInfo.map((item) => item.filePath);
		const filePaths = (await selectFiles(FileTypes.AUDIO)) as string[];
		if (filePaths.length) {
			const files = await queryAudiosInfo(filePaths);
			for (const file of files) {
				if (!pathList.includes(file.filePath)) AudioList.push(file);
			}
		}

		setSpinning(false);
		setFileInfo(AudioList);
	};

	const handleAudioTargetFormatChange = (
		fileInfo: AudioInfoObject,
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

	const handleChangeTargetDir = async () => {
		const dir = await selectDir();
		if (dir) {
			console.log("dir:", dir);
			setOutputDir(dir);
		}
	};

	const handleAudioTransformClick = async (
		fileInfo: AudioInfoObject,
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
		await convertAudioToOtherAudioType(fileInfo.filePath, output_file_path);
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
				await handleAudioTransformClick(fileInfo, false);
			})
		);
		setSpinning(false);
		message.success("一键转换成功！");
	};

	const handleChoosedAudio = (fileInfo: AudioInfoObject) => {
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

	const handleDeleteSingleAudio = (fileInfo: AudioInfoObject) => {
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

	const handleDeleteSelectedAudios = () => {
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
							添加音频文件
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
								<AudioItemOperator
									fileInfo={item}
									onHandleTargetFormatChange={handleAudioTargetFormatChange}
									onHandleTransformClick={handleAudioTransformClick}
									onHandleChoosed={handleChoosedAudio}
									onHandleDelete={handleDeleteSingleAudio}
								/>
							);
						})
					) : (
						<CommonBlankTip />
					)}
				</div>
				<div className={styles.bottomBox}>
					<div className={styles.outPathTitle}>输出路径:</div>
					<div className={styles.outPath}>{outputDir}</div>
					<Button
						type="primary"
						icon={<EditOutlined />}
						onClick={handleChangeTargetDir}
					>
						更改文件夹
					</Button>
					<div className={styles.transformBox}>
						<Button
							type="primary"
							icon={<SyncOutlined />}
							onClick={handleTransformOneClick}
						>
							一键转换
						</Button>
					</div>
				</div>
			</div>
		</Spin>
	);
}
