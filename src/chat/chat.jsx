import React, { useEffect, useContext, useState } from 'react';
import UserContext from './../UserContext.jsx';
import './chat.css';
import { ChatClass } from './chatClass.js';



export function Chat() {
  const { user, setUser } = useContext(UserContext);


  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/validate');
      if (response.status === 204) {
        const userResponse = await fetch('/api/secureUser');
        const userData = await userResponse.json();
      }
    };
    fetchUser();
  }, []);

  let chatData = ChatClass.getChatData();
  if (!Array.isArray(chatData)) {
    chatData = [];
  }

  return (
    <>
      <h2>Chat With Kaylie</h2>
      <div id="chatbox" className='chatbox'>
          <div id="messages" className="messages" style={{maxHeight: '500px', overflow: 'auto'}}>
            {chatData.map((chatData, index) => (
              <div key={index} className={chatData.sender === "Kaylie Jackson" ? "chat-container darker" : "chat-container"}>
                <img 
                  src={chatData.sender === "Kaylie Jackson" ? "../../../pics/android-chrome-512x512.png" : "../../../pics/greylogo.png"} 
                  alt={chatData.sender === "Kaylie Jackson" ? "KaylieAvatar" : "UserAvatar"} 
                  className={chatData.sender !== "Kaylie Jackson" ? "right" : ""}
                />
                <p className="chat-text">{chatData.message}</p>
                <span className={chatData.sender === "Kaylie Jackson" ? "chat-time-left" : "chat-time-right"}>
                  {chatData.timeStamp}
                </span>
              </div>
            ))}
          </div>
          <div className="messageInput">
            <img src="../../../pics/greylogo.png" alt="UserAvatar" className="right" />
            <form className = "input-group" type="text" id="form-control" >
              <input type="text" id="messageText" className="form-control" placeholder="Send a message..." name='messageText' />
              <button className='btn btn-outline-primary' onClick={ChatClass.sendMessage}>Send</button>
            </form>
            
          </div>
        </div>
    </>
    

  );
}