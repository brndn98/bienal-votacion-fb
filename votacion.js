window.addEventListener("load", function () {
    var baseApiUrl = "https://bienalnuevoleon.com/wp-json/wp/v2/";

    fetchCategories(baseApiUrl);

    function fetchCategories(base) {
        fetch(base + "categoria_curatorial")
            .then((res) => res.json())
            .then((data) => {
                var categories =
                    data.length > 0
                        ? data.map((cat) => {
                              cat.id, cat.slug;
                          })
                        : false;
                fetchProfesional(base, categories);
            })
            .catch((error) => console.log(error));
    }

    function fetchProfesional(base, categories) {
        fetch(base + "profesional?per_page=15")
            .then((res) => res.json())
            .then((data) => {
                var profesionales =
                    data.length > 0
                        ? data.map((post) => {
                              post.id, post.title.rendered, post.categoria_curatorial;
                          })
                        : false;
                fetchEstudiantil(base, categories, profesionales);
            })
            .catch((error) => console.log(error));
    }

    function fetchEstudiantil(base, categories, profesionales) {
        fetch(base + "estudiantil?per_page=15")
            .then((res) => res.json())
            .then((data) => {
                var estudiantiles =
                    data.length > 0
                        ? data.map((post) => {
                              post.id, post.title.rendered, post.categoria_curatorial;
                          })
                        : false;
                var posts = profesionales.concat(estudiantiles);
                setVotingData(categories, posts);
            })
            .catch((error) => console.log(error));
    }

    function setVotingData(categories, posts) {
        console.log(categories);
        console.log(posts);
    }
});
