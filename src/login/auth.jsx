import React from 'react';
import { Login } from './login.jsx';
import { SignUp } from './SignUp.jsx';

export function Auth() {
  return (
    <div className="login-container">
      <div className='left-column'>
        <Login />
      </div>
      
      <div className='right-column'>
        <SignUp />
      </div>
    </div>
  );
}