// Dallin Jackson 2/24/24
// kayliescreations.biz

/**
 * called when login button is clicked
 */
function login() {
    fetch('./users.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(userData => {
            console.log("Users: " + userData);

            let signIn = document.getElementById("login-form")
            let email = signIn["email"].value
            let password = signIn["password"].value
            let rememberMe = signIn["remember-me"].checked
            
            userData.forEach(user => {
                if (user["email"] === email && user["password"] === password) {
                    if (rememberMe) {
                        localStorage.setItem("user", JSON.stringify(user));
                        console.log("User saved to local storage");
                    } else {
                        sessionStorage.setItem("user", JSON.stringify(user));
                        console.log("User saved to session storage");
                    }
                    console.log("Logged in");
                    window.location.href = "index.html";
                }
            });
        })
        .catch(error => {
            console.log("Error: " + error);
        });
}

function logout() {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    window.location.href = "index.html";
}
