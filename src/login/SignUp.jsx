import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function SignUp() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [consent, setConsent] = useState(false);
    const [errors, setErrors] = useState({});
  
    const handleSignUp = async (event) => {
        event.preventDefault();
        // Your sign up function logic here

        let timeStampHours = new Date().getHours();
        let timeStampMinutes = new Date().getMinutes();
        if (timeStampMinutes < 10) {
            timeStampMinutes = "0" + timeStampMinutes;
        }
        let timeStampString = timeStampHours + ":" + timeStampMinutes;
        let timeStamp = timeStampString;

        if (consent) {
            let newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                address: {
                    addressLine1: address,
                    addressLine2: address2,
                    city: city,
                    state: state,
                    zip: zip,
                },
                chatData: [],
                orders: []
                
            }

            newUser.chatData.push({ "sender": "Kaylie Jackson", "message": "Welcome to my website!", "timeStamp": "Kaylie Jackson" + ': ' + timeStamp });
            console.log("New User: ", newUser);
            
            let newUserCall = await fetch('/api/auth/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            
            let response = await newUserCall.json();
            console.log("New User call response: ", response);

            if (response.msg === "Existing user") {
                console.log(response.error);
                document.getElementById("create-account").reset();
                
                let email = document.getElementById("inputEmail");
                email.className = "form-control is-invalid";

                let emailError = document.getElementById("emailHelp");
                emailError.innerHTML = "Email already in use.";



            } else {
                let user = response;
                sessionStorage.setItem("userEmail", JSON.stringify(user.email));
                let firstNameEntry = document.getElementById("inputFirstName");
                let lastNameEntry = document.getElementById("inputLastName");
                let emailEntry = document.getElementById("inputEmail");

                let consentEntry = document.getElementById("consent");

                firstNameEntry.className = "form-control is-valid";
                lastNameEntry.className = "form-control is-valid";
                emailEntry.className = "form-control is-valid";
                consentEntry.className = "form-check-input is-valid";

                await sleep(2000);
                navigate('/');
            }

        }


    };
  
    return (
    
        <main className="form-signin w-100 m-auto">

        
        <form id="create-account" onSubmit={handleSignUp}>
            <h1 className="h3 mb-3 fw-normal">Make an account</h1>
    
            <div className="form-floating">
            <input type="text" className="form-control" name="firstName" id="inputFirstName" placeholder="First" required
                value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <label htmlFor="inputFirstName">First Name</label>
            </div>
            <div className="form-floating">
            <input type="text" className="form-control" name="lastName" id="inputLastName" placeholder="Last" required
            value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <label htmlFor="inputLastName">Last Name</label>
        </div>

        <div className="form-floating">
            <input type="email" className="form-control" name="email" id="inputEmail" placeholder="Email" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="inputEmail">Email</label>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            {errors.email && <p className="error">{errors.email}</p>}

        </div>

        <div className="form-floating">
            <input type="password" className="form-control" name="password" id="inputPassword" placeholder="Password" required
            value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="inputPassword">Password</label>
            <div id="emailHelp" className="form-text">Must contatin 8 characters or digits.</div>
            {errors.password && <p className="error">{errors.password}</p>}
        </div>
        
        <div className="form-floating">
        <input type="text" className="form-control" name="address" id="inputAddress" placeholder="1234 Main St" required
          value={address} onChange={(e) => setAddress(e.target.value)} />
        <label htmlFor="inputAddress">Address</label>
      </div>

        <div className="form-floating">
        <input type="text" className="form-control" name="address2" id="inputAddress2" placeholder="Apartment, studio, or floor"
          value={address2} onChange={(e) => setAddress2(e.target.value)} />
        <label htmlFor="inputAddress2">Address 2</label>
        </div>

        <div className="form-floating">
        <input type="text" className="form-control" name="city" id="inputCity" placeholder="City" required
          value={city} onChange={(e) => setCity(e.target.value)} />
        <label htmlFor="inputCity">City</label>
        </div>

        <div className="form-floating">
            <select id="inputState" name="state" className="form-select" value={state} onChange={(e) => setState(e.target.value)} required>
                <option disabled value="">-Choose-</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
            </select>
            <label htmlFor="inputState">State</label>
        </div>

        <div className="form-floating">
        <input type="text" className="form-control" name="zip" id="inputZip" placeholder="Zip" required
          value={zip} onChange={(e) => setZip(e.target.value)} />
        <label htmlFor="inputZip">Zip</label>
        </div>


        <div className="checkbox mb-3">
        <label>
          <input type="checkbox" value="consent" id="consent" onChange={(e) => setConsent(e.target.checked)} /> I consent to Kaylie having my information to ship me my orders and contact me if nessecary.
        </label>
        </div>

        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign Up</button>
        <p className="mt-5 mb-3 text-muted">© 2024</p>

      </form>
    </main>
    );
  }