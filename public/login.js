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
            signIn["email"].value = "";
            signIn["password"].value = "";
            signIn["remember-me"].checked = false;

            displayError(signIn, ["floatingInput", "floatingPassword"]);

        } else if (rememberMe === true) {
            console.log("User logged in with remember me");
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "index.html";
        } else {
            console.log("User logged in without remember me");
            sessionStorage.setItem("user", JSON.stringify(user));
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error('Error:', error);
    }
    
    
}

function logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "index.html";
}

function displayError(form, idList) {
    console.log(idList);
    let email = document.getElementById(idList[0]);
    if (idList.length > 1) {
        let password = document.getElementById(idList[1]);
        password.className = "form-control is-invalid";
    }
    
    console.log(email);
    
    email.className = "form-control is-invalid";
    
    console.log(email);
    
    console.log("displayError: ", true);
}


async function createAccount() {
    let createAccount = document.getElementById("create-account");
    let firstName = createAccount["firstName"].value;
    let lastName = createAccount["lastName"].value;
    let email = createAccount["email"].value;
    let password = createAccount["password"].value;
    let address = createAccount["address"].value;
    let address2 = createAccount["address2"].value;
    let city = createAccount["city"].value;
    let state = createAccount["state"].value;
    let zip = createAccount["zip"].value;
    let consent = createAccount["consent"].checked;

    //chat code for welcome message
    let timeStampHours = new Date().getHours();
    let timeStampMinutes = new Date().getMinutes();
    if (timeStampMinutes < 10) {
        timeStampMinutes = "0" + timeStampMinutes;
    }
    let timeStampString = timeStampHours + ":" + timeStampMinutes;
    let timeStamp = timeStampString;

    if (consent) {
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            address: {
                addressLine1: address,
                addressLine2: address2,
                city: city,
                state: state,
                zip: zip,
            },
            isAdmin: false,
            chatData: [],
            orders: [],
            emailWhenStatusUpdate: false
            
        }
        newUser.chatData.push({ "sender": "Kaylie Jackson", "message": "Welcome to my website!", "timeStamp": "Kaylie Jackson" + ': ' + timeStamp });
        console.log("New User: ", newUser);
        
        let newUserCall = await fetch('/api/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        
        let response = await newUserCall.json();
        console.log("New User call response: ", response);

        if (response.error) {
            console.log(response.error);
            document.getElementById("create-account").reset();
            
            let email = document.getElementById("floatingCreateInput");
            email.className = "form-control is-invalid";



        } else {
            let user = response;
            sessionStorage.setItem("user", JSON.stringify(user));
            let firstNameEntry = document.getElementById("inputFirstName");
            let lastNameEntry = document.getElementById("inputLastName");
            let emailEntry = document.getElementById("floatingCreateInput");

            let consentEntry = document.getElementById("gridCheck");

            firstNameEntry.className = "form-control is-valid";
            lastNameEntry.className = "form-control is-valid";
            emailEntry.className = "form-control is-valid";
            consentEntry.className = "form-check-input is-valid";

            await sleep(1500);

            window.location.href = "index.html";
        }

    }
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}