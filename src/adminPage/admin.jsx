import React from 'react';
import { useEffect, useState, useContext } from 'react';
import UserContext from './../UserContext.jsx';
import { configureWebSocket } from './adminChat.js';
import { setUpForms } from './adminShopForms.js';
import './admin.css';
import { buildAdminTable } from './showOrders.js';

export function AdminPage() {
    const { user, setUser } = useContext(UserContext);
    const [isAdmin, setIsAdmin] = useState(false);

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

    if (!isAdmin) {
        
        return (
            <main>
                <h1>Admin Page</h1>
                <p>You are not authorized to view this page</p>
            </main>
        );
    } else {

        configureWebSocket();
        setUpForms();
        buildAdminTable();

        return (
            <main>
                <h3>Boss Gorl Page</h3>
                <button className="btn btn-primary" id="seeChatsButton">See Chats</button>
                <div className="chatbox" id="chatbox">
                    <div className="messages" id="messages"></div>
                </div>

                <div id="newShopCardForm" ></div>
                <div id="deleteShopItem" ></div>
                <form>
                    <h4>Delete Shop Item</h4>
                    <div id="deleteSelector"></div>
                </form>
                <hr />
                <div id="orders"></div>
                
            </main>
        );
    }

}