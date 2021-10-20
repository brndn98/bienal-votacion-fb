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
        fetch(base + "profesional?per_page=30")
            .then((res) => res.json())
            .then((data) => {
                var profesionales = data.length > 0 ? data.map((post) => ({ id: post.id, title: post.title.rendered, type: post.type, category: post.categoria_curatorial })) : false;
                fetchEstudiantil(base, categories, profesionales);
            })
            .catch((error) => console.log(error));
    }

    function fetchEstudiantil(base, categories, profesionales) {
        fetch(base + "estudiantil?per_page=30")
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
        var container = document.querySelector("#voting-container");
        var capture = {
            user: container.getAttribute("data-user"),
            vote: {},
        };

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
                    container.setAttribute("data-category", button.textContent.toLowerCase());
                    var categoryId = parseInt(button.getAttribute("data-id"), 10);
                    renderPosts(shuffled, categoryId, capture);
                }
            });
            catContainer.appendChild(cat);

            capture.vote[category.slug] = {
                profesional: false,
                estudiantil: false,
            };
        });

        container.setAttribute("data-category", categories[0].slug);
        renderPosts(shuffled, categories[0].id, capture);

        renderVoteCapture(capture);
    }

    function renderPosts(posts, category, capture) {
        var catSlug = document.querySelector("#voting-container").getAttribute("data-category");
        var container = {
            profesional: document.querySelector("#voting-profesional"),
            estudiantil: document.querySelector("#voting-estudiantil"),
        };
        var filtered = posts.filter((post) => {
            return existsInArray(post.category, category);
        });
        console.log(filtered);

        container.profesional.innerHTML = "";
        container.estudiantil.innerHTML = "";

        filtered.forEach((post) => {
            var div = document.createElement("div");
            div.className = "pv-l d-flex flex-center-v highlight";
            var p = document.createElement("p");
            p.className = "d-inline-block";
            p.textContent = post.id + " - " + post.title;
            var v = document.createElement("button");
            v.className = capture.vote[catSlug][post.type] == post.title ? "btn-cbx mh-s btn-cbx-active" : "btn-cbx mh-s";
            v.textContent = "votar";
            v.addEventListener("click", function (event) {
                var button = event.target;
                if (button.className.indexOf("btn-cbx-active") === -1) {
                    var current = container[post.type].querySelector(".btn-cbx-active");
                    if (current) current.className = current.className.replace(" btn-cbx-active", "");
                    button.className += " btn-cbx-active";
                    //alert("proyecto " + post.id + " seleccionado");
                    //var userID = container.getAttribute("data-user");
                    /* var vote = {
                        user: userID,
                        post: post.title,
                    };
                    sessionStorage.setItem("bienal-vote", JSON.stringify(vote));
                    window.location.href = container.getAttribute("data-url"); */
                    capture.vote[catSlug][post.type] = post.title;
                    renderVoteCapture(capture);
                }
            });

            div.appendChild(p);
            div.appendChild(v);

            container[post.type].appendChild(div);
        });
    }

    function renderVoteCapture(capture) {
        var captureContainer = document.querySelector("#voting-object");
        captureContainer.innerHTML = "";

        var containerTitle = document.createElement("h3");
        containerTitle.className = "mv-s c-red t-18";
        containerTitle.textContent = "Voto capturado";
        captureContainer.appendChild(containerTitle);

        var userInfo = document.createElement("div");
        userInfo.className = "mv-m";
        var userTitle = document.createElement("p");
        userTitle.className = "t-14 c-gray";
        userTitle.textContent = "Usuario";
        var userId = document.createElement("p");
        userId.className = "mh-s";
        userId.textContent = capture.user;
        userInfo.appendChild(userTitle);
        userInfo.appendChild(userId);
        captureContainer.appendChild(userInfo);

        var voteInfo = document.createElement("div");
        voteInfo.className = "mv-m";
        var voteTitle = document.createElement("p");
        voteTitle.className = "t-14 c-gray";
        voteTitle.textContent = "Votos";
        voteInfo.appendChild(voteTitle);

        for (var key in capture.vote) {
            var voteCategory = document.createElement("div");
            voteCategory.className = "mv-s mh-s";
            var categoryTitle = document.createElement("p");
            categoryTitle.className = "t-14";
            categoryTitle.textContent = key;
            voteCategory.appendChild(categoryTitle);
            for (var type in capture.vote[key]) {
                var cat = document.createElement("div");
                cat.className = "mv-s mh-s";
                var catTitle = document.createElement("p");
                catTitle.className = "t-14 c-gray";
                catTitle.textContent = type;
                var catText = document.createElement("p");
                catText.className = "mh-s";
                catText.textContent = capture.vote[key][type] === false ? "Sin seleccionar" : capture.vote[key][type];

                cat.appendChild(catTitle);
                cat.appendChild(catText);
                voteCategory.appendChild(cat);
            }
            voteInfo.appendChild(voteCategory);
        }

        captureContainer.appendChild(voteInfo);
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
