window.fbAsyncInit = function () {
    FB.init({
        appId: "253541850016970",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v12.0",
    });

    // checks if user is already logged in on facebook
    FB.getLoginStatus(function (response) {
        console.log(response);
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
                    window.location.href = button.getAttribute("data-url") + "unauthorized.html";
                } else {
                    //fbLogout();
                    fbLogin(button.getAttribute("data-url") + "votacion.html");
                    //window.location.href = button.getAttribute("data-url") + "votacion.html";
                }
            }, true);
        });
    }

    if (logoutButton) {
        loginButton.addEventListener("click", function (event) {
            var button = event.target;
            FB.getLoginStatus(function (response) {
                if (response.status === "connected") {
                    window.location.href = button.getAttribute("data-url");
                }
            }, true);
            fbLogout(button.getAttribute("data-url"));
        });
    }

    function fbLogin(url) {
        FB.login(function (response) {
            console.log("logged in");
            console.log(response);
            window.location.href = url;
        });
    }

    function fbLogout(url) {
        FB.logout(function (response) {
            console.log("logged out");
            console.log(response);
            window.location.href = url;
        });
    }
};
