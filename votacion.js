window.addEventListener("click", function () {
    fetch("http://bienalnuevoleon.com/wp-json/wp/v2/estudiantil")
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
