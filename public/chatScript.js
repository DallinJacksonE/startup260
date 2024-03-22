//Dallin Jackson 2/14/24
//kayliescreations.biz

async function displayChat() {

    
    const response = await fetch('/api/secureUser');
    const customer = await response.json(); 
    
    let userChatData = customer.chatData;
    
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
    img.src = "greylogo.png";
    
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

async function sendMessage() {

    const responseGettingUser = await fetch('/api/secureUser');
    const customer = await responseGettingUser.json();
    
    let userChatData = customer.chatData;
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

    let sentBy = customer["firstName"] + " " + customer["lastName"];

    userChatData.push({ "sender": sentBy, "message": message, "timeStamp": sentBy + ': ' + timeStamp });
    
    let jsonData = JSON.stringify(customer);
    
    let response = await fetch('/api/updateUserChat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonData,
    })
    if (response.status === 204) {
        console.log("Message sent");
    } else {
        console.log("Message not sent");
    }
    displayChat();
}