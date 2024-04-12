

class chatClass {

    customer;
    messagessList;
    socket;
  
    constructor() {
        this.messagessList = [];
        this.init();
        
    }

    async init() {
        await this.configureCustomer();
        if (this.customer) {
            this.messagessList = this.customer.chatData;
        }
        this.configureWebSocket();
    }

    configureWebSocket() {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        
        console.log(this.socket);
        this.socket.onopen = async (event) => {
            console.log('WebSocket connection is open.');
            const user = this.customer["email"];
            this.socket.send(JSON.stringify({ type: 'UserConnected', sender: user }));
        };
        this.socket.onclose = (event) => {
            // console.log('WebSocket connection closed. Attempting to reconnect...');
            // setTimeout(() => this.configureWebSocket(), 5000); // Attempt to reconnect after 5 seconds
        };
        this.socket.onmessage = async (event) => {
            const msg = JSON.parse(event.data);
            console.log(`Received message: ${msg.message}`);
            const response = await fetch('/api/secureUser');
            const customerData = await response.json();
            this.messagessList = customerData.chatData;
             
        };
        
        this.socket.onerror = (error) => {
            console.log(`WebSocket error: ${error}`);
          };
      }
  
    
    async configureCustomer() {
        let response = await fetch('/api/secureUser');
        let customerData = await response.json();
        this.customer = customerData;
    }
    
  
    sendMessage() {
        console.log('Sending message...');

        console.log(this.socket);
        if (!this.socket) {
            this.configureWebSocket();
        }

        let inputGroup = document.getElementById("input-group");
        let message = inputGroup["messageText"].value;
        console.log(message);
        inputGroup["messageText"].value = "";
        let timeStampHours = new Date().getHours();
        let timeStampMinutes = new Date().getMinutes();
        if (timeStampMinutes < 10) {
            timeStampMinutes = "0" + timeStampMinutes;
        }
        let timeStampString = timeStampHours + ":" + timeStampMinutes;
        let timeStamp = timeStampString;
    
        let sentBy = this.customer["firstName"] + " " + this.customer["lastName"];

        let newMessage = { "sender": sentBy, "message": message, "timeStamp": sentBy + ': ' + timeStamp, type: 'ChatMessage'};
    
        this.messagessList.push(newMessage);
        
        let jsonData = JSON.stringify(newMessage);
        console.log(jsonData);

        this.socket.send(jsonData);
        
    }
  
    getCookie(name) {
        let cookieArr = document.cookie.split(';');

        for(let i = 0; i < cookieArr.length; i++) {
            let cookiePair = cookieArr[i].split('=');

            if(name == cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }

        // Return null if the cookie by name does not exist
        return null;
    }  

    getChatData() {
        return this.messagessList;
    }

  }

  const ChatClass = new chatClass();
  export { ChatClass };