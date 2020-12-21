const headers = {
	"content-type": "application/json",
};

const body = JSON.stringify({
	email: "eve.holt@reqres.in",
	password: "cityslicka",
	pin: 18678,
});

export default async function makeHttpRequest(resource, method) {
	return await fetch(resource, {
		method,
		headers: method === "POST" ? headers : {},
		body: method === "POST" ? body : null,
	})
		.then((response) => response.json())
		.then((data) => data)
		.catch((err) => console.log(err));
}
