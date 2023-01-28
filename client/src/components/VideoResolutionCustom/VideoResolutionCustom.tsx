import React, { useState } from "react";
import styles from "./VideoResolutionCustom.module.less";
import blankTipIcon from "@src/assets/blank_tip.svg";
import { Divider, Input, Modal } from "antd";
import { videoResolutions } from "@src/constants/common";

interface Props {
	isModalVisible: boolean;
	onHandleModalOk: (resolution: string) => void;
	onHandleModalCancel: () => void;
}

export default function VideoResolutionCustom({
	isModalVisible = false,
	onHandleModalOk,
	onHandleModalCancel,
}: Props) {
	const [resolution, setResolution] = useState("");
	const [options, setOptions] = useState(videoResolutions);
	const [width, setWidth] = useState("");
	const [height, setHeight] = useState("");
	const [widthOnly, setWidthOnly] = useState("");
	const [heightOnly, setHeightOnly] = useState("");
	const handleItemClick = (index: number) => {
		const arr = options.slice();
		const len = arr.length;
		for (let i = 0; i < len; i++) {
			if (i === index) {
				arr[i].choosed = true;
			} else {
				arr[i].choosed = false;
			}
		}
		setOptions(arr);
		setResolution(arr[index].value);
		setWidth("");
		setHeight("");
		setHeightOnly("");
		setWidthOnly("");
	};
	const initOptions = () => {
		const arr = options.slice();
		const len = arr.length;
		for (let i = 0; i < len; i++) {
			arr[i].choosed = false;
		}
		setOptions(arr);
		setResolution("");
	};

	const handleWidthChange = (value: string) => {
		setWidth(value);
		initOptions();
		setWidthOnly("");
		setHeightOnly("");
	};
	const handleHeightChange = (value: string) => {
		setHeight(value);
		initOptions();
		setWidthOnly("");
		setHeightOnly("");
	};
	const handleWidthOnlyChange = (value: string) => {
		setWidthOnly(value);
		initOptions();
		setWidth("");
		setHeight("");
		setHeightOnly("");
	};
	const handleHeightOnlyChange = (value: string) => {
		setHeightOnly(value);
		initOptions();
		setWidth("");
		setHeight("");
		setWidthOnly("");
	};

	const handleModalOk = () => {
		if (resolution) {
			console.log("resolution", resolution);
			onHandleModalOk(resolution);
			return;
		}
		if (width && height) {
			if (Number(width) > 4096 || Number(height) > 2160) {
				onHandleModalOk("0");
				return;
			}
			const resolution = `${width}x${height}`;
			onHandleModalOk(resolution);
			console.log("resolution", resolution);
			return;
		}
		if (widthOnly) {
			if (Number(widthOnly) > 4096) {
				onHandleModalOk("0");
				return;
			}
			const resolution = `${widthOnly}x-1`;
			onHandleModalOk(resolution);
			console.log("resolution", resolution);
			return;
		}
		if (heightOnly) {
			if (Number(heightOnly) > 2160) {
				onHandleModalOk("0");
				return;
			}
			const resolution = `-1x${heightOnly}`;
			onHandleModalOk(resolution);
			console.log("resolution", resolution);
			return;
		}
		onHandleModalOk("0");
		console.log("no valid resolution");
	};
	const handleModalCancel = () => {
		onHandleModalCancel();
	};
	return (
		<Modal
			title="自定义视频分辨率"
			width={400}
			visible={isModalVisible}
			closable={false}
			onOk={handleModalOk}
			onCancel={handleModalCancel}
			maskClosable={false}
			maskStyle={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
			okText="确定"
			cancelText="取消"
		>
			<div className={styles.box}>
				{options.map((option, index) => {
					return (
						<div
							key={option.name}
							className={styles.item}
							style={{
								backgroundColor: option.choosed ? "rgb(180, 180, 180)" : "#fff",
							}}
							onClick={() => handleItemClick(index)}
						>
							{option.name}
						</div>
					);
				})}
				<Divider>自定义宽高</Divider>
				<div className={styles.configBox}>
					<Input
						addonBefore="宽度"
						className={styles.inputBox}
						value={width}
						onChange={(e) => handleWidthChange(e.target.value)}
					/>{" "}
					<Input
						addonBefore="高度"
						className={styles.inputBox}
						value={height}
						onChange={(e) => handleHeightChange(e.target.value)}
					/>
				</div>
				<div className={styles.configBox}>
					<Input
						addonBefore="宽度"
						className={styles.inputBox}
						value={widthOnly}
						onChange={(e) => handleWidthOnlyChange(e.target.value)}
					/>{" "}
					<Input
						addonBefore="高度"
						className={styles.inputBox}
						defaultValue="等比例缩放"
						disabled
					/>
				</div>
				<div className={styles.configBox}>
					<Input
						addonBefore="宽度"
						className={styles.inputBox}
						defaultValue="等比例缩放"
						disabled
					/>{" "}
					<Input
						addonBefore="高度"
						className={styles.inputBox}
						value={heightOnly}
						onChange={(e) => handleHeightOnlyChange(e.target.value)}
					/>{" "}
				</div>
			</div>
		</Modal>
	);
}
