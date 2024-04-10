import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext.jsx';

export function Logout() {
    const navigate = useNavigate();
    const { setUser } = React.useContext(UserContext);

    const handleLogout = async () => {
        localStorage.clear();
        sessionStorage.clear();

        await fetch('/api/auth/logout', {
        method: 'DELETE',
        });

        navigate('/');
        setUser(null);
    };

    return (
        <main>
        <button className="btn btn-primary w-50 py-2" id="logoutBtn" onClick={handleLogout}>Log Out</button>
        </main>
    );
}