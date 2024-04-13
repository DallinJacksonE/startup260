import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext.jsx';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function Login() {
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const userLogin = { email, password };

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userLogin)
    });

    if (response.ok) {
        if (rememberMe) {
            localStorage.setItem('userEmail', email);
        } else {
            sessionStorage.setItem('userEmail', email);
        }
        
        const userResponse = await fetch('/api/secureUser');
        const user = await userResponse.json();

        setUser(user);
        sleep(2000);
        navigate('/'); // Navigate to home page

    } else {
      setEmail('');
      setPassword('');
      alert('Login failed');
    }
  };

  return (
    <main className="form-signin w-100 m-auto">
      <form id="login-form" onSubmit={handleLogin}>
        <h1 className="h3 mb-3 fw-normal">Sign in</h1>
        <div className="form-floating" id="signInEmailContainer">
          <input type="email" className="form-control" id="floatingInput" name="email" placeholder="name@example.com" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating" id="signInPasswordContainer">
          <input type="password" className="form-control" id="floatingPassword" name="password" placeholder="Password" required
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="form-check text-start my-3">
          <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" name="remember-me"
            checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Remember me
          </label>
        </div>
        <button className="btn btn-primary w-100 py-2">Sign in</button>
      </form>
    </main>
  );
}

