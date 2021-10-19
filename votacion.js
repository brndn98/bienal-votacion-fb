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
        if (response.status === "connected") {
            fbLogout();
        } else {
            fbLogout();
            fbLogin();
        }
    }, true);

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
};

function fbLogin() {
    FB.login(function (response) {
        console.log("logged in");
        console.log(response);
    });
}

function fbLogout() {
    FB.logout(function (response) {
        console.log("logged out");
        console.log(response);
    });
}
