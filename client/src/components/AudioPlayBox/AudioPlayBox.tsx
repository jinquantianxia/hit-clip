import { useRef, useEffect, useState, useMemo } from "react";
import { Spin, Tooltip } from "antd";
import styles from "./AudioPlayBox.module.less";
import playIcon from "@src/assets/mp3_play.png";
import pauseIcon from "@src/assets/mp3_pause.png";
import { displayTimeFormat } from "@src/utils/common";
import { downloadFileUrl } from "@src/utils/file";

interface Props {
	title: string;
	url: string;
	pauseSign?: number;
	onHandlePlayClick: () => void;
}

export default function AudioPlayBox({
	title,
	url,
	pauseSign = 0,
	onHandlePlayClick,
}: Props) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const timer = useRef<NodeJS.Timer>();
	const [showPause, setShowPause] = useState(false);
	const [duration, setDuration] = useState(0);
	const currentTimeRef = useRef(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [playedWidth, setPlayedWidth] = useState(0);
	const [spinning, setSpinning] = useState(false);
	useEffect(() => {
		queryMp3Duration();
	}, []);

	useEffect(() => {
		const width = (currentTime / duration) * 160;
		setPlayedWidth(width);
	}, [currentTime]);

	useEffect(() => {
		if (pauseSign > 0) {
			stopPlay();
			if (!audioRef.current!.paused || !audioRef.current!.ended) {
				setShowPause(false);
			}
		}
	}, [pauseSign]);

	const queryMp3Duration = () => {
		setTimeout(() => {
			setDuration(Math.round(audioRef.current!.duration));
		}, 1000);
		// if (audioRef.current!.duration) {
		// 	setDuration(audioRef.current!.duration);
		// }
		// setTimeout(() => queryMp3Duration, 1000);
	};
	const startPlay = () => {
		setShowPause(true);
		audioRef.current!.play();
		timer.current = setInterval(() => {
			if (currentTimeRef.current === duration) {
				currentTimeRef.current = 0;
				setCurrentTime(0);
				stopPlay();
				return;
			}
			currentTimeRef.current += 1;
			setCurrentTime(currentTimeRef.current);
		}, 1000);
	};
	const stopPlay = () => {
		audioRef.current!.pause();
		setShowPause(false);
		clearInterval(timer.current!);
	};
	const handleClickPlay = () => {
		if (audioRef.current!.paused || audioRef.current!.ended) {
			if (audioRef.current!.ended) {
				audioRef.current!.currentTime = 0;
			}
			onHandlePlayClick();
			setTimeout(() => {
				startPlay();
			});
		} else {
			stopPlay();
		}
	};

	const handleDownloadClick = async (title: string, url: string) => {
		setSpinning(true);
		await downloadFileUrl(url, `${title}.mp3`);
		setTimeout(() => {
			setSpinning(false);
		}, 1000);
	};

	return (
		<Spin spinning={spinning} tip="下载中...">
			<div className={styles.audioItemBox}>
				<div className={styles.downloadBox}>
					<button onClick={() => handleDownloadClick(title, url)}>
						立即下载
					</button>
				</div>
				{/* <Tooltip title="prompt text" color="blue"> */}
				<div className={styles.audioTitle}>{title}</div>
				{/* </Tooltip> */}

				<div className={styles.audioContent}>
					{showPause ? (
						<img
							src={playIcon}
							className={styles.audioIcon}
							onClick={handleClickPlay}
						/>
					) : (
						<img
							src={pauseIcon}
							className={styles.audioIcon}
							onClick={handleClickPlay}
						/>
					)}
					<div className={styles.displayBox}>
						<div className={styles.time} style={{ textAlign: "right" }}>
							{displayTimeFormat(currentTime)}
						</div>
						<div className={styles.playBar}>
							<div
								className={styles.playedBar}
								style={{ width: playedWidth + "px" }}
							></div>
						</div>
						<div className={styles.time}>{displayTimeFormat(duration)}</div>
					</div>
				</div>
				<audio ref={audioRef}>
					<source src={url} type="audio/mpeg" />
				</audio>
			</div>
		</Spin>
	);
}
