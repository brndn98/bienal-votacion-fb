window.addEventListener("load", function () {
    var sessionItem = sessionStorage.getItem("bienal-vote");
    if (sessionItem) {
        var capture = JSON.parse(sessionItem);
        renderVoteCapture(capture);
    }

    function renderVoteCapture(capture) {
        var captureContainer = document.querySelector("#vote-object");
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
});
