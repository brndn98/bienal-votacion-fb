window.addEventListener("load", function () {
    fetch("https://bienalnuevoleon.com/wp-json/wp/v2/estudiantil")
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
});
