// ChatComponent.jsx
import React, { useEffect } from 'react';
import { configureWebSocket } from './chatScript';

export const ChatComponent = ({ user }) => {
    useEffect(() => {
        if (user) {
            configureWebSocket(user);
        } else {
            console.log('User not found');
        }
        
    }, [user]);

  return (
    <div id="chatbox" className='chatbox'>
      <div id="messages" className="messages" style={{maxHeight: '500px', overflow: 'auto'}} ></div>
      <div className="messageInput">
        <img src="../../../pics/greylogo.png" alt="UserAvatar" className="right" />
        <form className = "input-group" type="text" id="form-control" >
          <input type="text" id="messageText" className="form-control" placeholder="Send a message..." name='messageText' />
          <button className='btn btn-outline-primary'>Send</button>
        </form>
      </div>
    </div>
  );
};

