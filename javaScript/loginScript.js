//Dallin Jackson 2/16/24
//kayliescreations.biz

const loginForm = document.getElementById("login-form");
const signInForm = document.getElementById("");
// Assume this function is called after successful login
function onLoginSuccess() {
    window.location.href = 'index.html';
}

function adminLoginSuccess() {
    window.location.href = 'kayliesPage.html';
}

function loginError() {
    console.log("Failed attempt");
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("floatingInput").value;
    const password = document.getElementById("floatingPassword").value;

    // Fetch users data
    fetch('/users.json')
        .then(response => response.json())
        .then(users => {
            // Check if user exists and password is correct
            const user = (username in users) && users[username][0] === password;
            if (user) {
                if (users[username][1]) {
                    adminLoginSuccess();
                } else {
                    onLoginSuccess();
                }
                
            } else {
                loginError();
            }
        })
        .catch(error => console.error('Error:', error));

    
});