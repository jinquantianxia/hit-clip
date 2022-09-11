import { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import { queryAudioMaterials } from "@src/apis/spider_audio";
import { AudioMaterialItemInfo } from "@src/types/audio";
import styles from "./AudioMaterialSquare.module.less";
import AudioPlayBox from "@src/components/AudioPlayBox/AudioPlayBox";
import { AudioSpiderPages } from "@src/constants/audio";

export default function AudioMaterialSquare() {
	const [audios, setAudios] = useState<AudioMaterialItemInfo[]>([]);
	const [pauseSign, setPauseSign] = useState(0);
	const [spinning, setSpinning] = useState(false);
	useEffect(() => {
		queryAudioSearch(AudioSpiderPages[0].url);
	}, []);
	// //img-cdn2.yespik.com/sound/00/29/33/62/293362_0563242c78713029ba085fdcc42e7f99.mp3
	const handlePlayClick = () => {
		setPauseSign(pauseSign + 1);
	};

	const queryAudioSearch = async (url: string) => {
		const arr = await queryAudioMaterials(url);
		console.log("audio resource:", arr);
		setAudios(arr);
	};

	const handleChooseAudioType = async (url: string) => {
		setSpinning(true);
		await queryAudioSearch(url);
		setSpinning(false);
	};
	return (
		<Spin spinning={spinning}>
			<div className={styles.box}>
				<div className={styles.sortList}>
					{AudioSpiderPages.map((item) => {
						return (
							<Button
								type="default"
								onClick={() => handleChooseAudioType(item.url)}
								key={item.name}
								className={styles.sortItem}
							>
								{item.name}
							</Button>
						);
					})}
				</div>

				<div className={styles.audioList}>
					{audios.map((audio) => {
						return (
							<AudioPlayBox
								key={audio.url}
								title={audio.title}
								url={audio.url}
								pauseSign={pauseSign}
								onHandlePlayClick={handlePlayClick}
							/>
						);
					})}
				</div>
			</div>
		</Spin>
	);
}
