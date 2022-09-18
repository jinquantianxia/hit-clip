import { useState, useRef } from "react";
import { message, Button, Input, Spin } from "antd";
import { DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons";
import styles from "./VideoCombine.module.less";
import CommonBottom from "@src/components/CommonBottom/CommonBottom";
import { selectFiles, selectDir } from "@src/utils/file";
import { FileTypes } from "@src/types/common";
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
	DragUpdate,
} from "react-beautiful-dnd";
import deleteIcon from "@src/assets/delete.svg";
import { combineVideos } from "@src/apis/video";
import { filenameWithSuffix } from "@src/utils/file";

interface VideoListItem {
	localPath: string;
	name: string;
}

export default function VideoCombine() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [videoUrl, setVideoUrl] = useState("");
	const [targetName, setTargetName] = useState("拼接完成");
	const [outputDir, setOutputDir] = useState("");
	const [spinning, setSpinning] = useState(false);
	const [videoList, setVideoList] = useState<VideoListItem[]>([]);
	const handleChooseFile = async () => {
		// setSpinning(true);
		const filePaths = (await selectFiles(FileTypes.VIDEO)) as string[];
		const items = filePaths.map((path, index) => {
			return {
				localPath: path,
				name: filenameWithSuffix(path),
			};
		});
		setVideoList([...videoList, ...items]);
		handleViewSingleVideo(items[0].localPath);
		// console.log("filePaths", filePaths);
	};
	const handleChangeTargetDir = (path: string) => {
		if (path) {
			console.log("dir:", path);
			setOutputDir(path);
		}
	};
	const handleTransformOneClick = async () => {
		if (!outputDir) {
			message.info("您还没有设置输出文件夹！");
			return;
		}
		setSpinning(true);
		const input_paths = videoList.map((video) => video.localPath).join(",");
		const output_path = `${outputDir}${targetName}.mp4`;
		console.log("input_paths:", input_paths, "output_path:", output_path);
		await combineVideos(input_paths, output_path, "");
		setSpinning(false);
		message.success("一键转换成功！");
	};
	const handleViewSingleVideo = (videoLocalPath: string) => {
		setVideoUrl(`http://localhost:8080/${videoLocalPath}`);
	};

	const reorder = (
		list: VideoListItem[],
		startIndex: number,
		endIndex: number
	) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

	const onDragEnd = (result: DropResult) => {
		console.log(result);
		if (!result.destination) {
			return;
		}

		const items = reorder(
			videoList,
			result.source.index,
			result.destination.index
		);

		setVideoList(items);
	};

	const onDragUpdate = (initial: DragUpdate) => {
		console.log("onDragUpdate", initial);
	};

	const handleRemoveVideo = (name: string) => {
		const arr = videoList.slice();
		const len = arr.length;
		for (let i = 0; i < len; i++) {
			if (videoList[i].name === name) {
				arr.splice(i, 1);
				break;
			}
		}
		setVideoList(arr);
	};

	return (
		<Spin spinning={spinning}>
			<div className={styles.box}>
				<div className={styles.container}>
					<div className={styles.chooseBtn}>
						<Button
							type="primary"
							icon={<PlusSquareOutlined />}
							onClick={handleChooseFile}
						>
							添加视频文件
						</Button>
						<div className={styles.targetNameBox}>
							<div className={styles.targetTitle}>转换后的文件名:</div>
							<Input
								style={{ width: "160px" }}
								value={targetName}
								onChange={(e) => setTargetName(e.target.value)}
							/>
							<div>.mp4</div>
						</div>
					</div>
					<div className={styles.displayBox}>
						<video
							ref={videoRef}
							className={styles.videoBox}
							src={videoUrl}
							// onCanPlay={handleVideoCanPlay}
							controls
						></video>
					</div>
					<div className={styles.dragBox}>
						<DragDropContext onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
							<Droppable droppableId="id" direction="horizontal">
								{(provided) => (
									<div
										className={styles.dragList}
										ref={provided.innerRef}
										{...provided.droppableProps}
									>
										{videoList.map((video, index) => {
											return (
												<Draggable
													key={video.name}
													draggableId={video.name}
													index={index}
												>
													{(provided) => (
														<div
															className={styles.dragItem}
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
														>
															<div className={styles.deleteBox}>
																<img
																	src={deleteIcon}
																	onClick={() => handleRemoveVideo(video.name)}
																/>
															</div>
															<div
																className={styles.videoName}
																onClick={() =>
																	handleViewSingleVideo(video.localPath)
																}
															>
																{video.name}
															</div>
														</div>
													)}
												</Draggable>
											);
										})}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
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
