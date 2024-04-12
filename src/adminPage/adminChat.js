// Dallin Jackson 3/28/24
// kayliescreations.biz


export async function configureWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    let socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    console.log(socket);
    let kayliesAdminChat;
    
    socket.onopen = (event) => {
        let adminData = {email : "kayliescreations30@gmail.com"}
        console.log('WebSocket connection is open.');
        const user = adminData.email;
        socket.send(JSON.stringify({ type: 'UserConnected', sender: user }));
        kayliesAdminChat = new adminChat(socket);
        const button = document.getElementById('seeChatsButton');

        button.onclick = function() {
            let chatWindows = kayliesAdminChat.getCustomerWindows();
            chatWindows.forEach(customer => {
                customer.setInactive();
            });
            kayliesAdminChat.chatSelector();
        }

    };
    socket.onclose = (event) => {
        console.log('WebSocket connection closed');
    };
    socket.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        console.log(`Received message: ${msg.message}`);
        const response = await fetch(`/api/user/${msg.customer}`);
        const customerData = await response.json();
        
        let map = kayliesAdminChat.getCustomerWindows();

        let object = map.get(msg.customer);
        object.updateMessages(customerData.user.chatData);
        if (object.active === true) {
            object.displayChat();
        }
        
    };
    socket.onerror = (error) => {
        console.log(`WebSocket error: ${error}`);
      };
  }


class adminChat {
    socket;
    adminData;
    customers;
    customerWindows = new Map();

    constructor(socket) {
        
        this.adminData = {email : "kayliescreations30@gmail.com"}
        this.init();
        this.socket = socket;
    }

    async init() {
        await this.getCustomers();
        this.buildCustomerWindowChats();
    }

    async getCustomers() {
        let userData = await fetch('/api/adminAccess')
                .then(response => response.json())
                .then(data => {
                    return data;
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        this.customers = userData;
        this.customers.shift();
    }

    buildCustomerWindowChats() {
        this.customers.forEach(customer => {
            this.customerWindows.set(customer.email, new adminChatWindow(customer, this.socket));
        });
    }

    getCustomerWindows() {
        return this.customerWindows;
    }

    async chatSelector() {

        let chatBox = document.getElementById("chatbox");
        chatBox.innerHTML = '';
        let containerDiv = document.createElement("div");
        containerDiv.className = "container text-center";
        let rowDiv = document.createElement("div");
        rowDiv.className = "row row-cols-1 row-cols-sm-2 row-cols-md-4";

        this.customerWindows.forEach((adminChatWindowObject, email) => {

            let colDiv = document.createElement("div");
            colDiv.className = "col";

            let button = document.createElement("button");
            button.type = "button";

            let messageData = adminChatWindowObject.getMessages();

            if (messageData.length === 0) {
                button.className = "btn btn-info";
            } else if (messageData[messageData.length -1].sender !== "Kaylie Jackson") {
                button.className = "btn btn-warning";
            } else {
                button.className = "btn btn-primary";
            }
            
            let userData = adminChatWindowObject.getCustomer();

            button.textContent = userData["firstName"] + " " + userData ["lastName"];
            button.onclick = function() {
                adminChatWindowObject.setActive();
                adminChatWindowObject.displayChat();
            }

            colDiv.appendChild(button);
            rowDiv.appendChild(colDiv);
            containerDiv.appendChild(rowDiv);
            chatBox.prepend(containerDiv);
        });

    }

}

class adminChatWindow {
    customer;
    messagessList;
    socket;
    active = false;

    constructor(customer, socket) {
        this.customer = customer;
        if (customer) {
            this.messagessList = customer.chatData;
        } else {
            this.messagessList = [];
        }
        this.socket = socket;
       
    }

    async displayChat() { 
        
        let userChatData = this.messagessList;
        
        
        let chatBox = document.getElementById("chatbox");
        chatBox.innerHTML = '';
        let chatContainer = document.createElement("div");
        chatContainer.id = "messages";
        chatContainer.className = "messages";
        chatContainer.style.maxHeight = '500px';
        chatContainer.style.overflow = 'auto';
        chatBox.appendChild(chatContainer);
    
        for (let i = 0; i < userChatData.length; i++) {
            let chat = document.createElement("div");
            chat.className = "chat-container";
            let img = document.createElement("img");
            let p = document.createElement("p");
            let span = document.createElement("span");
    
            if (userChatData[i]["sender"] === "Kaylie Jackson") {
                chat.className = "chat-container darker";
                img.src = "../../../pics/android-chrome-512x512.png";
                img.alt = "KaylieAvatar";
                p.textContent = userChatData[i]["message"];
                span.className = "chat-time-left";
            } else {
                img.src = "../../../pics/greylogo.png";
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
        img.src = "../../../pics/android-chrome-512x512.png";
        
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
        button.id = "sendButton";
        button.onclick = this.sendMessage.bind(this);
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
        this.scrollToBottom();
    
    }

    scrollToBottom() {
        var objDiv = document.getElementById("messages");
        if (objDiv === null) {
            return;
        } else {
            objDiv.scrollTop = objDiv.scrollHeight;
        }
        
    }

    async sendMessage() {
        if (this.socket.readyState === 1) {
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
        
            let sentBy = "Kaylie Jackson";

            let newMessage = { "sender": sentBy, "message": message, "timeStamp": sentBy + ': ' + timeStamp, type: 'ChatMessage', recipient: this.customer.email};
        
            this.messagessList.push(newMessage);
            
            let jsonData = JSON.stringify(newMessage);
            
            this.socket.send(jsonData);

            this.displayChat();
        } else {
            console.log('WebSocket connection is not open.');
        }
        
    }

    getMessages() {
        return this.messagessList;
    }

    getCustomer() {
        return this.customer;
    }

    updateMessages(messageData) {
        this.messagessList = messageData;
    }

    setInactive() {
        this.active = false;
    }

    setActive() {
        this.active = true;
    }

}


