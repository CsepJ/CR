document.addEventListener("DOMContentLoaded", () => {
	fetch("/meal", {
		method: "POST"
    })
    .then(r => r.json())
    .then(result => {
			document.querySelector("div").innerHTML = "<div>"+result.title+"</div><div>"+result.text+"</div>"
	});
});
