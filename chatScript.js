//Dallin Jackson 2/14/24
//kayliescreations.biz

{/* <div class="chat-container">
    <img src="android-chrome-512x512.png" alt="KaylieAvatar">
    <p>Hello. How are you today?</p>
    <span class="chat-time-right">11:00</span>
</div> */}

async function displayChat() {
    // let userData = await fetch('./users.json')
    // .then(response => response.json())
    // .then(data => {
    //     return data;
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });

    let loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    //let user = userData.find(user => user["username"] === loggedInUser["username"]);
    let userChatData = loggedInUser["chatData"];
    let chatContainer = document.getElementById("messages");
    chatContainer.innerHTML = "";
    for (let i = 0; i < userChatData.length; i++) {
        let chat = document.createElement("div");
        chat.className = "chat-container";
        let img = document.createElement("img");
        let p = document.createElement("p");
        let span = document.createElement("span");

        if (userChatData[i]["sender"] === "kaylie") {
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

}

displayChat();

async function sendMessage() {

    // let userData = await fetch('./users.json')
    // .then(response => response.json())
    // .then(data => {
    //     return data;
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });

    let loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    // let user = userData.find(user => user["username"] === loggedInUser["username"]);
    let userChatData = loggedInUser["chatData"];
    let inputGroup = document.getElementById("input-group");
    let message = inputGroup["messageText"].value;
    inputGroup["messageText"].value = "";
    let timeStampHours = new Date().getHours();
    let timeStampMinutes = new Date().getMinutes();
    let timeStampString = timeStampHours + ":" + timeStampMinutes;
    let timeStamp = timeStampString;
    userChatData.push({ "sender": "user", "message": message, "timeStamp": timeStamp });
    
    // this is just until the server is set up
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    sessionStorage.setItem("user", JSON.stringify(loggedInUser));

    // will use code below when server is set up

    // const fs = require('fs');
    
    // let jsonData = JSON.stringify(userData, null, 2);
    
    // fs.writeFile('data.json', jsonData, (err) => {
    //     if (err) {
    //         console.error('Error writing file', err);
    //     } else {
    //         console.log('Successfully wrote to file');
    //     }
    // });

    displayChat();
    
}