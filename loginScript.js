// Dallin Jackson
// kayliescreations.biz

async function fetchUserData() {
    const httpResponse = await fetch('./users.json');
    const userData = await httpResponse.json();
    console.log(userData);
    console.log('done');
    return userData;
}


async function adminLogin() {
    const userData = await fetchUserData();
    console.log("Users: " + userData);
    console.log(userData[0]["username"])
    let signIn = document.getElementById("login-form")
    let userName = signIn["username"].value
    let password = signIn["password"].value

    console.log(userName + " " + password);
    userData.forEach(user => {
        if (user["username"] === userName && user["password"] === password && user["isAdmin"]) {
            console.log("Logged in")
        }
    });

}