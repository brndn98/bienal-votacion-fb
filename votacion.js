window.addEventListener("load", function () {
    fetch("https://bienalnuevoleon.com/wp-json/wp/v2/estudiantil", {
        method: "GET",
        mode: "no-cors",
        credentials: "omit",
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});
