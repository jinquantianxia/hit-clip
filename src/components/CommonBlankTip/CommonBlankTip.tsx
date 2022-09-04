import styles from "./CommonBlankTip.module.less";
import blankTipIcon from "@src/assets/blank_tip.svg";

export default function CommonBlankTip() {
	return (
		<div className={styles.blankTipBox}>
			<div className={styles.innerBox}>
				<img src={blankTipIcon} />
				<div className={styles.tip}>您还未选择文件</div>
			</div>
		</div>
	);
}
