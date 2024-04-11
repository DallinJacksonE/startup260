import React from 'react';
import { Login } from './login.jsx';
import { SignUp } from './SignUp.jsx';
import './login.css';

export function Auth() {
  return (
    <div className="columns-container">
      <div className='left-column'>
        <Login />
      </div>
      
      <div className='right-column'>
        <SignUp />
      </div>
    </div>
  );
}