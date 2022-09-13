import React, { useState, useEffect, useRef } from "react";
import { Spin, Slider, Button, Modal, Input } from "antd";
import {
	DeleteOutlined,
	PlusSquareOutlined,
	EditOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import styles from "./VideoCrop.module.less";
import { selectFiles, selectDir } from "@src/utils/file";
import { trimVideo, cropVideo } from "@src/apis/video";
import { VideoInfoObject } from "@src/types/video";
import { FileTypes } from "@src/types/common";
import CommonBottom from "@src/components/CommonBottom/CommonBottom";
import playIcon from "@src/assets/mp3_play.png";
import pauseIcon from "@src/assets/mp3_pause.png";
import { displayVideoTimeFormat } from "@src/utils/video";
import timeIcon from "@src/assets/time.png";
import cropIcon from "@src/assets/crop.png";
import { filenameWithSuffix, fileSuffix } from "@src/utils/file";

export default function VideoCrop() {
	const [spinning, setSpinning] = useState(false);
	const [showPause, setShowPause] = useState(true);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isCrop, setIsCrop] = useState(false);
	const [videoLocalPath, setVideoLocalPath] = useState("");
	const [videoUrl, setVideoUrl] = useState("");
	const [sliderMax, setSliderMax] = useState(0);
	const [startTime, setStartTime] = useState("00:00:00");
	const [endTime, setEndTime] = useState("00:00:00");
	const [outputDir, setOutputDir] = useState("");
	const [clickX, setClickX] = useState(0);
	const [clickY, setClickY] = useState(0);
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);
	const [w, setW] = useState(0);
	const [h, setH] = useState(0);

	useEffect(() => {
		if (videoLocalPath) {
			setVideoUrl(`http://localhost:8080/${videoLocalPath}`);
			setTimeout(() => {
				console.log("videoRef duration:", videoRef.current!.duration);
				setSliderMax(Math.round(videoRef.current!.duration));
			}, 1000);
		}
	}, [videoLocalPath]);
	const handleChooseFile = async () => {
		// setSpinning(true);
		const filePaths = (await selectFiles(FileTypes.VIDEO, false)) as string[];
		if (filePaths.length) {
			setVideoLocalPath(filePaths[0]);
		}
	};

	const handleChangeTargetDir = (path: string) => {
		if (path) {
			console.log("dir:", path);
			setOutputDir(path);
		}
	};

	// const handleClickPlay = () => {
	// 	if (videoRef.current!.paused || videoRef.current!.ended) {
	// 		if (videoRef.current!.ended) {
	// 			videoRef.current!.currentTime = 0;
	// 		}
	// 		setShowPause(false);
	// 		videoRef.current!.play();
	// 	} else {
	// 		setShowPause(true);
	// 		videoRef.current!.pause();
	// 	}
	// };
	const handleSliderChange = (range: [number, number]) => {
		videoRef.current!.currentTime = range[0];
		setStartTime(displayVideoTimeFormat(range[0]));
		setEndTime(displayVideoTimeFormat(range[1]));
		console.log("change:", range);
	};

	const handleCropMouseDown = (e: any) => {
		// x 210 y 55
		setX(e.pageX - 210);
		setClickX(e.pageX);
		setY(e.pageY - 55);
		setClickY(e.pageY);
		// console.log("e", e);
	};

	const handleCropMouseUp = (e: any) => {
		// x 210 y 55
		setW(e.pageX - clickX);
		setH(e.pageY - clickY);
	};

	const handleClickCropVideo = () => {
		setIsCrop(!isCrop);
	};

	const handleTransformOneClick = async () => {
		setSpinning(true);
		const output_file_path = `${videoLocalPath.split(".")[0]}_crop.${fileSuffix(
			videoLocalPath
		)}`;
		// console.log("output_file_path", output_file_path);
		console.log(
			"videoLocalPath, output_file_path, startTime, endTime",
			videoLocalPath,
			output_file_path,
			startTime,
			endTime
		);
		await trimVideo(videoLocalPath, output_file_path, startTime, endTime);
		// crop=w:h:x:y
		const cropStr = `"crop=${w}:${h}:${x}:${y}"`;
		const output_path = `${
			videoLocalPath.split(".")[0]
		}_crop_finish.${fileSuffix(videoLocalPath)}`;
		await cropVideo(output_file_path, output_path, cropStr);
		setSpinning(false);
	};
	return (
		<Spin spinning={spinning}>
			<div className={styles.box}>
				<div className={styles.mainBox}>
					{!videoLocalPath ? (
						<div className={styles.chooseBtn}>
							<Button
								type="primary"
								icon={<PlusSquareOutlined />}
								onClick={handleChooseFile}
							>
								添加视频文件
							</Button>
						</div>
					) : (
						<div className={styles.videoWraperBox}>
							<div className={styles.videoWraper}>
								<video
									ref={videoRef}
									className={styles.videoBox}
									src={videoUrl}
									controls
								></video>
								{isCrop && (
									<div
										className={styles.cropLayer}
										onMouseDown={handleCropMouseDown}
										onMouseUp={handleCropMouseUp}
									>
										<div
											className={styles.cropBox}
											style={{
												left: x + "px",
												top: y + "px",
												width: w + "px",
												height: h + "px",
											}}
										></div>
									</div>
								)}
							</div>
							<div className={styles.rightBtns}>
								<div className={styles.btnBox}>
									<Button onClick={handleChooseFile}>更换视频</Button>
								</div>
								<div className={styles.btnBox}>
									<Button onClick={handleClickCropVideo}>
										{isCrop ? "完成截取" : "截取区域"}
									</Button>
								</div>
							</div>
						</div>
					)}
					<div className={styles.operateBox}>
						<div className={styles.sliderBox}>
							{/* <div className={styles.playBox}>
								{showPause ? (
									<img src={pauseIcon} onClick={handleClickPlay} />
								) : (
									<img src={playIcon} onClick={handleClickPlay} />
								)}
							</div> */}
							<div className={styles.slider}>
								<Slider
									range
									defaultValue={[0, 1]}
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
					<div className={styles.areaBox}>
						<div className={styles.titleBox}>
							<img src={cropIcon} />
							区域截取
						</div>
						<div className={styles.lineBox}>
							<div className={styles.itemBox}>
								<div className={styles.labelTitle}>左边距</div>
								<div className={styles.areaValue}>{x}</div>
							</div>
							<div className={styles.itemBox}>
								<div className={styles.labelTitle}>上边距</div>
								<div className={styles.areaValue}>{y}</div>
							</div>
						</div>
						<div className={styles.lineBox}>
							<div className={styles.itemBox}>
								<div className={styles.labelTitle}>宽度</div>
								<div className={styles.areaValue}>{w}</div>
							</div>
							<div className={styles.itemBox}>
								<div className={styles.labelTitle}>高度</div>
								<div className={styles.areaValue}>{h}</div>
							</div>
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
