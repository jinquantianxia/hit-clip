import { AudioMaterialItemInfo } from "@src/types/audio";
import { fetchPost } from "@src/utils/request";
import { REQ_PATHS } from "./req_path";

export async function queryAudioMaterials(url: string) {
	const resp = await fetchPost(REQ_PATHS.QUERY_AUDIO_SQUARE_REARCH, {
		url,
	});
	const arr = (await resp.json()) as AudioMaterialItemInfo[];
	return arr;
}
