export async function fetchPost(path: string, body: Object) {
	console.log("post param: ", JSON.stringify(body));
	return await fetch(`http://localhost:8080${path}`, {
		method: "post",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
	});
}
