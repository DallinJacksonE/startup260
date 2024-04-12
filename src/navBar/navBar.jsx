//Dallin Jackson 2/24/24
// kayliescreations.biz

/**
 * if user is logged in, then the navbar has the shop and ticket links, and the login link is removed
 * if user is not, then the navbar has the login link, and the shop is replaced with a gallery page that
 * generates the shop cards without the buy button.
 */

import React, { useEffect, useState, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from './../UserContext.jsx';



export function NavBar() {
    // Add the useState hook
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [isAdmin, setIsAdmin] = useState(false);

    // Add the useEffect hook
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('/api/validate');
            if (response.status === 204) {
                const userResponse = await fetch('/api/secureUser');
                const userData = await userResponse.json();
                setUser(userData);
                setIsAdmin(userData.isAdmin);
            }
        };
        fetchUser();
    }, [setUser, setIsAdmin]);

    // Add the handleLogout function
    const handleLogout = async () => {
        localStorage.clear();
        sessionStorage.clear();
        await fetch('/api/auth/logout', {
            method: 'DELETE',
        })
        .then(() => {
            setUser(null);
            setIsAdmin(false);
            navigate('/login');
            
        })
        .catch((error) => {
            console.error('Error during logout:', error);
        });
    };
    
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" style={{ fontFamily: 'Goblin One', color: '#1b4965', fontSize: '1.2em' }}>
                    Kaylie's Creations
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to=''>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="shop">Shop</Link>
                        </li>
                        {user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="cart">Cart</Link>
                                </li>
                                <li className="nav-item">
                                    <a href="#" className="nav-link" onClick={handleLogout}>Logout</a>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="user">🧶 {user.firstName}</Link>
                                </li>
                                {isAdmin && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="admin" style={{ color: 'darkred' }}>Admin</Link>
                                    </li>
                                )}
                            </>
                        )}
                        {!user && (
                            <li className="nav-item">
                                <Link className="nav-link" to="login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};



