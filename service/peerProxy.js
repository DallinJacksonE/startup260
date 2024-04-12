const { WebSocketServer } = require('ws');
const uuid = require('uuid');
const db = require('./database.js');


function peerProxy(httpServer) {
  // Create a websocket object
  const wss = new WebSocketServer({ noServer: true });

  // Handle the protocol upgrade from HTTP to WebSocket
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });

  // Keep track of all the connections so we can forward messages
  let connections = [];

  wss.on('connection', (ws) => {
    const connection = { id: uuid.v4(), alive: true, ws: ws };
    connections.push(connection);

    // on message
    ws.on('message', async (data) => {
      console.log(`Received message: ${data}`);

      
      let message = JSON.parse(data);

      if (message.type === 'UserConnected') {
        connection.userEmail = message.sender;
        
        console.log(`User connected: ${connection.userEmail}`);
      } else if (message.type === 'ChatMessage') {
        if (connection.userEmail !== "kayliescreations30@gmail.com") {
          //if a message is for kaylie, and Kaylie is online, update her chat window
          const userToStoreMessageData = await db.getUser(connection.userEmail);
          userToStoreMessageData.chatData.push(message);
          await db.updateUser(userToStoreMessageData);
          console.log(`Stored message from ${connection.userEmail}`);
          
          connections.forEach((c) => {
            if (c.userEmail === "kayliescreations30@gmail.com") {
              c.ws.send(JSON.stringify({ type: 'update', message: "Update Chat windows", customer: connection.userEmail }));
            }
          });
          
          
        } else if (connection.userEmail === "kayliescreations30@gmail.com") {
          //if the message is from kaylie, and the customer is online, update their chat window
          const userToStoreMessageData = await db.getUser(message.recipient);
          userToStoreMessageData.chatData.push(message);
          await db.updateUser(userToStoreMessageData);
          console.log(`Stored message from ${connection.userEmail}`);
          
          connections.forEach((c) => {
            if (c.userEmail === message.recipient) {
              c.ws.send(JSON.stringify({ type: 'update', message: "Update Chat windows" }));
            }
          });
        } else {
          console.error(`User with email ${connection.userEmail} not found in the database.`);
        }
      } else if (message.type === 'pong') {
        ws.send('Pong');
      }
    });

    // Remove the closed connection so we don't try to forward anymore
    ws.on('close', () => {
      const pos = connections.findIndex((o, i) => o.id === connection.id);

      if (pos >= 0) {
        connections.splice(pos, 1);
      }
    });

    // Respond to pong messages by marking the connection alive
    ws.on('pong', () => {
      console.log('Received pong');
      connection.alive = true;
    });
  });

  // Keep active connections alive
  setInterval(() => {
    connections.forEach((c) => {
      // Kill any connection that didn't respond to the ping last time
      if (!c.alive) {
        c.ws.terminate();
      } else {
        c.alive = false;
        c.ws.ping();
      }
    });
  }, 60000);
}

module.exports = { peerProxy };
