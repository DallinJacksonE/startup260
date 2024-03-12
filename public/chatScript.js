//Dallin Jackson 2/14/24
//kayliescreations.biz

async function displayChat(customer = null) {

    let adminBool = false;

    if (customer === null) {
        customer = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
        if (!customer) {
            window.location.href = "login.html";
        } else {
            userChatData = customer["chatData"];
        }
        
    } else {
        admin = JSON.parse(localStorage.getItem("admin")) || JSON.parse(sessionStorage.getItem("admin"));
        userChatData = customer["chatData"];
        adminBool = true;
    }
    
    
    let chatBox = document.getElementById("chatbox");
    chatBox.innerHTML = '';
    let chatContainer = document.createElement("div");
    chatContainer.id = "messages";
    chatContainer.className = "messages";
    chatContainer.style.maxHeight = '500px';
    chatContainer.style.overflowY = 'auto';
    chatBox.appendChild(chatContainer);

    for (let i = 0; i < userChatData.length; i++) {
        let chat = document.createElement("div");
        chat.className = "chat-container";
        let img = document.createElement("img");
        let p = document.createElement("p");
        let span = document.createElement("span");

        if (userChatData[i]["sender"] === "Kaylie Jackson") {
            chat.className = "chat-container darker";
            img.src = "android-chrome-512x512.png";
            img.alt = "KaylieAvatar";
            p.textContent = userChatData[i]["message"];
            span.className = "chat-time-left";
        } else {
            img.src = "greylogo.png";
            img.alt = "UserAvatar";
            img.className = "right";
            p.textContent = userChatData[i]["message"];
            span.className = "chat-time-right";
        }

        p.className = "chat-text";
        span.textContent = userChatData[i]["timeStamp"];
        chat.appendChild(img);
        chat.appendChild(p);
        chat.appendChild(span);
        chatContainer.appendChild(chat);
        
    }

    //build the input group
    let messageInput = document.createElement("div");
    messageInput.className = "messageInput";
    let img = document.createElement("img");
    if (adminBool) {
        img.src = "android-chrome-512x512.png";
    } else {
        img.src = "greylogo.png";
    }
    
    img.alt = "Avatar";
    img.className = "right";
    let form = document.createElement("form");
    form.className = "input-group";
    form.id = "input-group";
    document.body.appendChild(form);
    let input = document.createElement("input");
    input.type = "text";
    input.className = "form-control";
    input.placeholder = "Text message";
    input.name = "messageText";
    let button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-primary";
    button.textContent = "Send";
    button.type = "submit";
    button.onclick = function() {
        event.preventDefault();
        sendMessage(customer);
    }
    let svg = document.createElement("svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("class", "bi bi-send-fill");
    svg.setAttribute("viewBox", "0 0 16 16");
    let path = document.createElement("path");
    path.setAttribute("d", "M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z");
    svg.appendChild(path);
    button.appendChild(svg);
    form.appendChild(input);
    form.appendChild(button);
    messageInput.appendChild(img);
    messageInput.appendChild(form);
    chatBox.appendChild(messageInput);
    scrollToBottom();

}

function scrollToBottom() {
    var objDiv = document.getElementById("messages");
    if (objDiv === null) {
        return;
    } else {
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    
}

async function sendMessage(customer = null) {

    let adminBool = false;

    if (customer === null) {
        customer = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
        if (!customer) {
            window.location.href = "login.html";
        }
        
    } else {
        admin = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
        adminBool = true;
    }
    
    let userChatData = customer["chatData"];
    let inputGroup = document.getElementById("input-group");
    let message = inputGroup["messageText"].value;
    inputGroup["messageText"].value = "";
    let timeStampHours = new Date().getHours();
    let timeStampMinutes = new Date().getMinutes();
    if (timeStampMinutes < 10) {
        timeStampMinutes = "0" + timeStampMinutes;
    }
    let timeStampString = timeStampHours + ":" + timeStampMinutes;
    let timeStamp = timeStampString;

    let sentBy;
    if (adminBool) {
        sentBy = admin["firstName"] + " " + admin["lastName"];
    } else {
        sentBy = customer["firstName"] + " " + customer["lastName"];
    }

    userChatData.push({ "sender": sentBy, "message": message, "timeStamp": sentBy + ': ' + timeStamp });
    
    let jsonData = JSON.stringify(customer);
    
    let response = await fetch('/api/updateUserData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonData,
    })
    let data = await response.json();
    console.log("Chat data update call: ", data.success);

    displayChat(customer);
}

async function chatSelector() {

    let userData;

    try {

    userData = await fetch('/api/safeUserData')
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });

    let chatBox = document.getElementById("chatbox");
    chatBox.innerHTML = '';
    let containerDiv = document.createElement("div");
    containerDiv.className = "container text-center";
    let rowDiv = document.createElement("div");
    rowDiv.className = "row row-cols-1 row-cols-sm-2 row-cols-md-4";

    for (let i = 1; i < userData.length; i++) {
        let colDiv = document.createElement("div");
        colDiv.className = "col";

        let button = document.createElement("button");
        if (userData[i]["chatData"][userData[i]["chatData"].length-1]["sender"] !== "Kaylie Jackson") {
            button.className = "btn btn-outline-warning";
        } else {
            button.className = "btn btn-primary";
        }
        
        button.textContent = userData[i]["firstName"] + " " + userData[i]["lastName"];
        button.onclick = function() {
            displayChat(userData[i]);
        }
        colDiv.appendChild(button);
        rowDiv.appendChild(colDiv);
        containerDiv.appendChild(rowDiv);
        chatBox.prepend(containerDiv);
    }

    } catch (error) {

        console.error('Error:', error);
    }
}