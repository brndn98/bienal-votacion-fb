window.fbAsyncInit = function () {
    FB.init({
        appId: "253541850016970",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v12.0",
    });

    // checks if user is already logged in on facebook
    FB.getLoginStatus(function (response) {
        var votingContainer = document.querySelector("#voting-container");
        console.log(response);

        if (votingContainer) {
            if (response.status === "connected") {
                votingContainer.setAttribute("data-user", response.authResponse.userID);
                if (checkforVote(response.authResponse.userID)) {
                    window.location.href = url + "unauthorized.html";
                }
            } else {
                window.location.href = votingContainer.getAttribute("data-url");
            }
        }
    });

    /* FB.login(function (response) {
        if (response.authResponse) {
            console.log("Welcome!  Fetching your information.... ");
            FB.api("/me", function (response) {
                console.log("Good to see you, " + response.name + ".");
            });
        } else {
            console.log("User cancelled login or did not fully authorize.");
        }
    }); */

    var loginButton = document.querySelector("#login-voting");
    var logoutButton = document.querySelector("#logout-voting");
    if (loginButton) {
        loginButton.addEventListener("click", function (event) {
            var button = event.target;
            FB.getLoginStatus(function (response) {
                if (response.status === "connected") {
                    window.location.href = button.getAttribute("data-url") + "votacion.html";
                } else {
                    fbLogin(button.getAttribute("data-url"));
                }
            }, true);
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            var button = event.target;
            FB.getLoginStatus(function (response) {
                if (response.status === "connected") {
                    fbLogout(button.getAttribute("data-url"));
                }
            }, true);
            //fbLogout(button.getAttribute("data-url"));
        });
    }

    function fbLogin(url) {
        FB.login(function (response) {
            console.log("logged in");
            console.log(response);
            if (checkforVote(response.authResponse.userID)) {
                window.location.href = url + "unauthorized.html";
            } else {
                window.location.href = url + "votacion.html";
            }
        });
    }

    function fbLogout(url) {
        FB.logout(function (response) {
            console.log("logged out");
            console.log(response);
            window.location.href = url;
        });
    }

    function checkforVote(user) {
        var sessionItem = sessionStorage.getItem("bienal-vote");
        if (sessionItem) {
            var vote = JSON.parse(sessionItem);
            if (vote.user == user) {
                return true;
            }
        }
        return false;
    }
};
