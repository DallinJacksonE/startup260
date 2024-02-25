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
            
            userData.forEach(user => {
                if (user["email"] === email && user["password"] === password) {
                    console.log("Logged in")
                    window.location.href = "index.html"
                    localStorage.setItem("user", JSON.stringify(user))
                }
            });
        })
        .catch(error => {
            console.log("Error: " + error);
        });
}

function logout() {
    localStorage.removeItem("user")
    window.location.href = "index.html"
}
