import React, { useState } from 'react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);


  const handleLogin = async () => {
    // Your login function logic here
    login();
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

async function login() {
    
    let signIn = document.getElementById("login-form")
    let email = signIn["email"].value
    let password = signIn["password"].value
    let rememberMe = signIn["remember-me"].checked
    let userLogin = {email: email, password: password}

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLogin)
    });
    
    if (response.ok ) {
        if (rememberMe === true) {
            localStorage.setItem('userEmail', email);
        } else {
            sessionStorage.setItem('userEmail', email);
        }
        
    } else {
    signIn.reset();
    signIn["email"].className = "form-control is-invalid";
    signIn["password"].className = "form-control is-invalid";
    }
    
}