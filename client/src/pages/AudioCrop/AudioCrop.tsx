import React, { useState, useEffect, useRef, useMemo } from "react";
import { Spin, Slider, Button, Modal, Input, message } from "antd";
import {
	DeleteOutlined,
	PlusSquareOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import styles from "./AudioCrop.module.less";
import { selectFiles, selectDir } from "@src/utils/file";
import { cropAudio } from "@src/apis/audio";
import { AudioInfoObject } from "@src/types/audio";
import { FileTypes } from "@src/types/common";
import CommonBottom from "@src/components/CommonBottom/CommonBottom";
import playIcon from "@src/assets/mp3_play.png";
import pauseIcon from "@src/assets/mp3_pause.png";
import { displayVideoTimeFormat } from "@src/utils/video";
import timeIcon from "@src/assets/time.png";
import cropIcon from "@src/assets/crop.png";
import { filenameWithSuffix, fileSuffix } from "@src/utils/file";
import { showFileExplorer } from "@src/backend_calls/common";
import { LOCAL_SERIVCE_BASE_URL } from "@src/constants/common";

export default function AudioCrop() {
	const [spinning, setSpinning] = useState(false);
	const audioRef = useRef<HTMLAudioElement>(null);
	const [audioLocalPath, setAudioLocalPath] = useState("");
	const [audioUrl, setAudioUrl] = useState("");
	const [sliderMax, setSliderMax] = useState(0);
	const [startTime, setStartTime] = useState("00:00:00");
	const [endTime, setEndTime] = useState("00:00:00");
	const [showAudio, setShowAudio] = useState(true);
	const canTrim = useMemo(() => {
		return startTime !== "00:00:00" || endTime !== "00:00:00";
	}, [startTime, endTime]);
	const [outputDir, setOutputDir] = useState("");

	useEffect(() => {
		if (audioLocalPath) {
			setShowAudio(false);
			console.log("Audio local path: " + audioLocalPath);
			setAudioUrl(`${LOCAL_SERIVCE_BASE_URL}/${audioLocalPath}`);
			setTimeout(() => {
				setShowAudio(true);
			});
			setTimeout(() => {
				console.log("audioRef duration:", audioRef.current!.duration);
				setSliderMax(Math.round(audioRef.current!.duration));
			}, 2000);
		}
	}, [audioLocalPath]);

	const handleChooseFile = async () => {
		const filePaths = (await selectFiles(FileTypes.AUDIO, false)) as string[];
		if (filePaths.length) {
			console.log("filePaths:", filePaths);
			setAudioLocalPath(filePaths[0]);
		}
	};

	const handleChangeTargetDir = (path: string) => {
		if (path) {
			console.log("dir:", path);
			setOutputDir(path);
		}
	};

	const handleSliderChange = (range: [number, number]) => {
		audioRef.current!.currentTime = range[0];
		setStartTime(displayVideoTimeFormat(range[0]));
		setEndTime(displayVideoTimeFormat(range[1]));
		console.log("change:", range);
	};

	const handleTransformOneClick = async () => {
		setSpinning(true);
		let output_file_path = outputDir;
		if (canTrim) {
			output_file_path = `${outputDir}\\trim_${filenameWithSuffix(
				audioLocalPath
			)}`;
			// console.log("output_file_path", output_file_path);
			console.log(
				"audioLocalPath, output_file_path, startTime, endTime",
				audioLocalPath,
				output_file_path,
				startTime,
				endTime
			);
			const extra = `${startTime},${endTime}`;
			await cropAudio(audioLocalPath, output_file_path, extra);
			message.success("转换成功！");
			setAudioLocalPath(output_file_path);
		}

		setSpinning(false);
	};

	return (
		<Spin spinning={spinning} tip="转换中...">
			<div className={styles.box}>
				<div className={styles.mainBox}>
					{!audioLocalPath ? (
						<div className={styles.chooseBtn}>
							<Button
								type="primary"
								icon={<PlusSquareOutlined />}
								onClick={handleChooseFile}
							>
								添加音频文件
							</Button>
						</div>
					) : (
						<div className={styles.audioWraperBox}>
							{showAudio && (
								<audio controls ref={audioRef}>
									<source src={audioUrl} type="audio/mpeg" />
								</audio>
							)}
						</div>
					)}
					<div className={styles.operateBox}>
						<div className={styles.sliderBox}>
							<div className={styles.sliderTitle}>滑动截取时间段</div>
							<div className={styles.slider}>
								<Slider
									range
									step={1}
									defaultValue={[0, 0]}
									min={0}
									max={sliderMax}
									tooltipPlacement="top"
									onChange={(value: [number, number]) =>
										handleSliderChange(value)
									}
									tipFormatter={(value?: number) =>
										displayVideoTimeFormat(value || 0)
									}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.controlBox}>
					<div className={styles.timeBox}>
						<div className={styles.titleBox}>
							<img src={timeIcon} />
							时间截取
						</div>
						<div className={styles.itemBox}>
							<div className={styles.labelTitle}>开始时间</div>
							<div className={styles.time}>{startTime}</div>
						</div>
						<div className={styles.itemBox}>
							<div className={styles.labelTitle}>结束时间</div>
							<div className={styles.time}>{endTime}</div>
						</div>
					</div>

					<div className={styles.btnsBox}>
						<div className={styles.btnBox}>
							<Button
								className={styles.btn}
								onClick={() =>
									showFileExplorer(fileSuffix(audioLocalPath, false))
								}
							>
								打开所在文件夹
							</Button>
						</div>
						<div className={styles.btnBox}>
							<Button className={styles.btn} onClick={handleChooseFile}>
								更换音频
							</Button>
						</div>
					</div>
				</div>
				<CommonBottom
					onHandleChangeLocalPath={handleChangeTargetDir}
					onHandleClickOneKeyTransform={handleTransformOneClick}
				/>
			</div>
		</Spin>
	);
}
