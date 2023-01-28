import { LOCAL_SERIVCE_BASE_URL } from "@src/constants/common";

export async function fetchPost(path: string, body: Object) {
	console.log("post param: ", JSON.stringify(body));
	return await fetch(`${LOCAL_SERIVCE_BASE_URL}${path}`, {
		method: "post",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
	});
}
