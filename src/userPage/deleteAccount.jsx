import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext.jsx';

export function DeleteAccount() {
    const navigate = useNavigate();
    const { setUser } = React.useContext(UserContext);

    const handleDeleteAccount = async () => {
        try {
            let response = await fetch('/api/secureUser');
            let user = await response.json(); // Parse the response as JSON

            let email = user.email
            let response2 = await fetch('/api/deleteUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            
            if (response2.status === 204) {
                console.log('Account deleted');
                localStorage.clear();
                sessionStorage.clear();
                navigate('/');
                setUser(null);

            } else {
                console.log('Account not deleted');
            }
        } catch (err) {
            console.error(`Failed to delete account: ${err}`);
        }
        
    };

    return (
        
        <button className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
        
    );
}