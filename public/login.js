// Dallin Jackson 2/24/24
// kayliescreations.biz

/**
 * called when login button is clicked
 */
async function login() {
    
    let signIn = document.getElementById("login-form")
    let email = signIn["email"].value
    let password = signIn["password"].value
    let rememberMe = signIn["remember-me"].checked
    let userLogin = {email: email, password: password}

    try {
        const response = await fetch('/api/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userLogin)
        });

        const user = await response.json();
        console.log("User: ", user);
        if (user.error) {
            console.log(user.error);
        } else if (rememberMe === true) {
            console.log("User logged in with remember me");
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            console.log("User logged in without remember me");
            sessionStorage.setItem("user", JSON.stringify(user));
        }
    } catch (error) {
        console.error('Error:', error);
    }
    
    
}

function logout() {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    window.location.href = "index.html";
}
