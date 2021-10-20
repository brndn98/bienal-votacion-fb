window.addEventListener("load", function () {
    var baseApiUrl = "https://bienalnuevoleon.com/wp-json/wp/v2/";

    fetchCategories(baseApiUrl);

    function fetchCategories(base) {
        fetch(base + "categoria_curatorial")
            .then((res) => res.json())
            .then((data) => {
                var categories = data.length > 0 ? data.map((cat) => ({ id: cat.id, slug: cat.slug })) : false;
                fetchProfesional(base, categories);
            })
            .catch((error) => console.log(error));
    }

    function fetchProfesional(base, categories) {
        fetch(base + "profesional?per_page=15")
            .then((res) => res.json())
            .then((data) => {
                var profesionales = data.length > 0 ? data.map((post) => ({ id: post.id, title: post.title.rendered, type: post.type, category: post.categoria_curatorial })) : false;
                fetchEstudiantil(base, categories, profesionales);
            })
            .catch((error) => console.log(error));
    }

    function fetchEstudiantil(base, categories, profesionales) {
        fetch(base + "estudiantil?per_page=15")
            .then((res) => res.json())
            .then((data) => {
                var estudiantiles = data.length > 0 ? data.map((post) => ({ id: post.id, title: post.title.rendered, type: post.type, category: post.categoria_curatorial })) : false;
                var posts = profesionales.concat(estudiantiles);
                setVotingData(categories, posts);
            })
            .catch((error) => console.log(error));
    }

    function setVotingData(categories, posts) {
        var catContainer = document.querySelector("#voting-categories");
        var helper = document.querySelector("#voting-helper");

        var cleaned = posts.filter((post) => post.category.length > 0);
        var shuffled = shuffleArray(cleaned);

        categories.forEach((category, cIndex) => {
            var cat = document.createElement("button");
            cat.className = cIndex == 0 ? "btn mv-s mh-s btn-active" : "btn mv-s mh-s";
            cat.setAttribute("data-id", category.id);
            cat.textContent = category.slug.toUpperCase();
            cat.addEventListener("click", function (event) {
                var button = event.target;
                if (button.className.indexOf("btn-active") === -1) {
                    var current = catContainer.querySelector(".btn-active");
                    if (current) current.className = current.className.replace(" btn-active", "");
                    button.className += " btn-active";
                    helper.textContent = button.textContent.toLowerCase();
                    var categoryId = parseInt(button.getAttribute("data-id"), 10);
                    renderPosts(shuffled, categoryId);
                }
            });
            catContainer.appendChild(cat);
        });

        helper.textContent = categories[0].slug;
        renderPosts(shuffled, categories[0].id);
    }

    function renderPosts(posts, category) {
        var container = document.querySelector("#voting-container");
        var filtered = posts.filter((post) => {
            return existsInArray(post.category, category);
        });
        console.log(filtered);

        container.innerHTML = "";

        filtered.forEach((post) => {
            var div = document.createElement("div");
            div.className = "mv-s";
            var p = document.createElement("p");
            p.className = "d-inline-block";
            p.textContent = post.id + " - " + post.title;
            var v = document.createElement("button");
            v.className = "btn-cbx mh-s";
            v.textContent = "votar";
            v.addEventListener("click", function (event) {
                var button = event.target;
                button.className += " btn-cbx-active";
                alert("proyecto " + post.id + " seleccionado");
                var userID = container.getAttribute("data-user");
                var vote = {
                    user: userID,
                    post: post.title,
                };
                sessionStorage.setItem("bienal-vote", JSON.stringify(vote));
                window.location.href = container.getAttribute("data-url");
            });

            div.appendChild(p);
            div.appendChild(v);

            container.appendChild(div);
        });
    }

    function existsInArray(array, find) {
        for (var i = 0; i < array.length; i++) {
            if (find == array[i]) return true;
        }
        return false;
    }

    function shuffleArray(array) {
        var shuffledArray = array
            .map((item) => ({ item, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map((shuffledItem) => shuffledItem.item);

        return shuffledArray;
    }
});
