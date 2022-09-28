import React, { useState, useEffect, useRef, useMemo } from "react";
import { Spin, Slider, Button, Modal, Input, message } from "antd";
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
import { showFileExplorer } from "@src/backend_calls/common";

export default function VideoCrop() {
	const [spinning, setSpinning] = useState(false);
	const [showPause, setShowPause] = useState(true);
	const videoRef = useRef<HTMLVideoElement>(null);
	const videoWrperRef = useRef<HTMLDivElement>(null);
	const [isCrop, setIsCrop] = useState(false);
	const [videoLocalPath, setVideoLocalPath] = useState("");
	const [videoUrl, setVideoUrl] = useState("");
	const [sliderMax, setSliderMax] = useState(0);
	const [startTime, setStartTime] = useState("00:00:00");
	const [endTime, setEndTime] = useState("00:00:00");
	const canTrim = useMemo(() => {
		return startTime !== "00:00:00" || endTime !== "00:00:00";
	}, [startTime, endTime]);
	const [outputDir, setOutputDir] = useState("");
	const [rate, setRate] = useState(1);
	const [clickX, setClickX] = useState(0);
	const [clickY, setClickY] = useState(0);
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);
	const [w, setW] = useState(0);
	const [h, setH] = useState(0);
	const [wraperX, setWraperX] = useState(0);
	const [wraperY, setWraperY] = useState(0);

	useEffect(() => {
		if (videoLocalPath) {
			setVideoUrl(`http://localhost:8080/${videoLocalPath}`);
			setTimeout(() => {
				console.log("videoRef duration:", videoRef.current!.duration);
				setSliderMax(Math.round(videoRef.current!.duration));
			}, 1000);
		}
		setTimeout(() => {
			setWraperX(videoWrperRef.current!.offsetLeft);
			setWraperY(videoWrperRef.current!.offsetTop);
			// console.log("videoRef", videoWrperRef);
		}, 1000);
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
		setX(e.pageX - wraperX - 210);
		setClickX(e.pageX);
		setY(e.pageY - wraperY - 35);
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

	const handleClickTrim = async () => {
		setSpinning(true);
		const output_file_path = `${outputDir}\\trim_${filenameWithSuffix(
			videoLocalPath
		)}`;
		console.log("output_file_path:", output_file_path);
		await trimVideo(videoLocalPath, output_file_path, startTime, endTime);
		setTimeout(() => {
			setVideoLocalPath(output_file_path);
			setStartTime("00:00:00");
			setEndTime("00:00:00");
			setSpinning(false);
		}, 1000);
	};

	const handleTransformOneClick = async () => {
		if (!canTrim && w === 0 && h === 0) {
			message.info("您还没有选择截取的时间段或视频区域，无法一键转换！");
			return;
		}
		setSpinning(true);
		let output_file_path = outputDir;
		if (canTrim) {
			output_file_path = `${outputDir}\\trim_${filenameWithSuffix(
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
			setVideoLocalPath(output_file_path);
		}
		if (w !== 0 && h !== 0) {
			setTimeout(async () => {
				// crop=w:h:x:y
				const wt = Math.round(w / rate);
				const ht = Math.round(h / rate);
				const xt = Math.round(x / rate);
				const yt = Math.round(y / rate);
				const cropStr = `crop=${wt}:${ht}:${xt}:${yt}`;
				const output_path = `${outputDir}\\crop_${filenameWithSuffix(
					videoLocalPath
				)}`;
				const input_file_path = canTrim ? output_file_path : videoLocalPath;
				await cropVideo(input_file_path, output_path, cropStr);
				setVideoLocalPath(output_path);
				setSpinning(false);
			}, 1000);
		} else {
			setSpinning(false);
		}
	};

	const handleVideoCanPlay = (e: any) => {
		// video height 400
		const rate = 400 / videoRef.current!.videoHeight;
		setRate(rate);
	};

	return (
		<Spin spinning={spinning} tip="转换中...">
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
							<div className={styles.videoWraper} ref={videoWrperRef}>
								<video
									ref={videoRef}
									className={styles.videoBox}
									src={videoUrl}
									onCanPlay={handleVideoCanPlay}
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
							<div className={styles.trimBtn}>
								<Button onClick={handleClickTrim} disabled={!canTrim}>
									立即截取
								</Button>
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
								{/* <div className={styles.areaValue}>{x}</div> */}
								<input
									className={styles.areaValue}
									value={x}
									onChange={(e) => setX(Number(e.target.value))}
								/>
							</div>
							<div className={styles.itemBox}>
								<div className={styles.labelTitle}>上边距</div>
								{/* <div className={styles.areaValue}>{y}</div> */}
								<input
									className={styles.areaValue}
									value={y}
									onChange={(e) => setY(Number(e.target.value))}
								/>
							</div>
						</div>
						<div className={styles.lineBox}>
							<div className={styles.itemBox}>
								<div className={styles.labelTitle}>宽度</div>
								{/* <div className={styles.areaValue}>{w}</div> */}
								<input
									className={styles.areaValue}
									value={w}
									onChange={(e) => setW(Number(e.target.value))}
								/>
							</div>
							<div className={styles.itemBox}>
								<div className={styles.labelTitle}>高度</div>
								{/* <div className={styles.areaValue}>{h}</div> */}
								<input
									className={styles.areaValue}
									value={h}
									onChange={(e) => setH(Number(e.target.value))}
								/>
							</div>
						</div>
					</div>
					<div className={styles.btnsBox}>
						<div className={styles.btnBox}>
							<Button
								className={styles.btn}
								onClick={() =>
									showFileExplorer(fileSuffix(videoLocalPath, false))
								}
							>
								打开所在文件夹
							</Button>
						</div>
						<div className={styles.btnBox}>
							<Button className={styles.btn} onClick={handleChooseFile}>
								更换视频
							</Button>
						</div>
						<div className={styles.btnBox}>
							<Button className={styles.btn} onClick={handleClickCropVideo}>
								{isCrop ? "完成截取" : "截取区域"}
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
