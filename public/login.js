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

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLogin)
    });
    
    if (response.ok ) {
        if (rememberMe === true) {
            localStorage.setItem('userEmail', email);
        } else {
            sessionStorage.setItem('userEmail', email);
        }
        window.location.href = 'index.html';
    } else {
    signIn.reset();
    signIn["email"].className = "form-control is-invalid";
    signIn["password"].className = "form-control is-invalid";
    }
    
}

function logout() {
    localStorage.clear();
    sessionStorage.clear();
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => (window.location.href = '/'));

    window.location.href = "index.html";
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
            chatData: [],
            orders: []
            
        }
        newUser.chatData.push({ "sender": "Kaylie Jackson", "message": "Welcome to my website!", "timeStamp": "Kaylie Jackson" + ': ' + timeStamp });
        console.log("New User: ", newUser);
        
        let newUserCall = await fetch('/api/auth/create', {
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
            sessionStorage.setItem("userEmail", JSON.stringify(user.email));
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