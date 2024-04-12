// Dallin Jackson 3/12/24
// kayliescreations.biz


import React, { useEffect, useState, useContext } from 'react';
import UserContext from './../UserContext.jsx';

function BuildUserTable() {
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('/api/secureUser');
            const data = await response.json();
            setUserData(data);
            setIsLoading(false);
        };
        fetchUser();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    let userTable = document.getElementById('userEndOrders');
    if (userTable === null) {
        return null;
    } 
    
    return (
        <>
            <div className="card w-100">
                <div className="card-body">
                    <h5 className="card-title">{userData.firstName} {userData.lastName}</h5>
                    < BuildTable userData={userData} userEnd={true} />
                    < CreatePastOrdersAccordian userData={userData} userEnd={true} />
                </div>
            </div>
        </>
    );


}

async function BuildAdminTable() {
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/adminAccess');
            const data = await response.json();
            setUserData(data);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div id="orders" className="container">
                {userData.map(user => (
                    <CreateCard userData={user} userEnd={false} />
                ))}
            </div>
        </>
    );
}

    async function updateOrderData({ userData, call, id }) {
        //edit data for the call
        if (call === 'finishOrder') {
            userData.orders.forEach(order => {
                if (order.uniqueId === id) {
                    order.complete = true;
                }
            });
        }
        if (call === 'markShipped') {
            userData.orders.forEach(order => {
                if (order.uniqueId === id) {
                    order.shipped = true;

                    let dateShipped = new Date();
                    let dateShippedString = dateShipped.getMonth() + 1 + "/" + dateShipped.getDate() + "/" + dateShipped.getFullYear();
                    order.dateShipped = dateShippedString;

                }
            });
        }  
        if (call === 'clearOrders') {
            userData.orders = [];
        }
        if (call === 'markUnshipped') {
            userData.orders.forEach(order => {
                if (order.uniqueId === id) {
                    order.shipped = false;
                    order.dateShipped = '';
                }
            });
        }

        let jsonData = JSON.stringify(userData);

        try {
            const response = await fetch('/api/updateUserOrders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonData,
            });
            console.log("Order data for user update call: ", response.status);
        } catch (error) {
            console.error('Error:', error);
        }
    }

function BuildTable({ userData, userEnd = false }) {


    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Item Name</th>
                        <th>Date Ordered</th>
                        <th>Comments</th>
                        <th>Created</th>
                        <th>Shipped</th>
                        {!userEnd && <th>Finish Order</th>}
                        {!userEnd && <th>Complete Shipping</th>}
                    </tr>
                </thead>
                <tbody>
                    {userData && userData.orders && userData.orders.map(order => {
                        if (order.shipped === false) {
                            return (
                                <tr key={order.uniqueId}>
                                    <td>{order.uniqueId}</td>
                                    <td>{order.card.title}</td>
                                    <td>{order.dateSubmitted}</td>
                                    <td>{order.comments}</td>
                                    <td>{order.complete ? 'Completed' : 'Pending'}</td>
                                    <td>{order.shipped ? 'True' : 'Pending'}</td>
                                    {!userEnd && <td><button className="btn btn-outline-primary" onClick={() => updateOrderData(userData, 'finishOrder', order.uniqueId)}>Complete</button></td>}
                                    {!userEnd && <td><button className="btn btn-outline-success" onClick={() => updateOrderData(userData, 'markShipped', order.uniqueId)}>Shipped</button></td>}
                                </tr>
                            );
                        }
                    })}
                </tbody>
            </table>

        </>
    );
}


function CreateCard({ userData, userEnd = false }) {
  
    return (
        <>
            <div className="card w-100">
                <div className="card-body">
                    <h5 className="card-title">{userData.firstName} {userData.lastName}</h5>
                    < BuildTable userData={userData} userEnd={userEnd} />
                    < CreatePastOrdersAccordian userData={userData} userEnd={userEnd} />
                </div>
            </div>
        </>
    );
}


function CreatePastOrdersAccordian({ userData, userEnd = false }) {

    let id = userData && userData.email ? userData.email.replace(/\./g, '-').replace(/@/g, '-') : '';

    return (
        <>
            <div className="accordion" id={id + 'PastOrders'}>
                <div className="accordion-item">
                    <h2 className="accordion-header" id={id + 'PastOrders'}>
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={'#' + id + 'PastOrdersCollapse'} aria-expanded="true" aria-controls={id + 'PastOrdersCollapse'}>
                            Past Orders
                        </button>
                    </h2>
                    <div id={id + 'PastOrdersCollapse'} className="accordion-collapse collapse" aria-labelledby={id + 'PastOrders'} data-bs-parent={'#' + id + 'PastOrders'}>
                        <div className="accordion-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Item Name</th>
                                        <th>Date Shipped</th>
                                        <th>Shipped</th>
                                        {!userEnd && <th>Mark Unshipped</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData && userData.orders ? userData.orders.map(order => {
                                        if (order.shipped === true) {
                                            return (
                                                <tr key={order.uniqueId}>
                                                    <td>{order.uniqueId}</td>
                                                    <td>{order.card.title}</td>
                                                    <td>{order.dateShipped}</td>
                                                    <td>{order.complete ? 'Completed' : 'Pending'}</td>
                                                    {!userEnd && <td><button className="btn btn-outline-danger" onClick={() => updateOrderData(userData, 'markUnshipped', order.uniqueId)}>Unship</button></td>}
                                                </tr>
                                            );
                                        }
                                    }) : null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id={id + 'ShippingInfo'}>
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={'#' + id + 'ShippingInfoCollapse'} aria-expanded="true" aria-controls={id + 'ShippingInfoCollapse'}>
                            Shipping Information
                        </button>
                    </h2>
                    <div id={id + 'ShippingInfoCollapse'} className="accordion-collapse collapse" aria-labelledby={id + 'ShippingInfo'} data-bs-parent={'#' + id + 'ShippingInfo'}>
                        <div className="accordion-body">
                            <p>Email: {userData.email ? userData.email : "loading"}</p>
                            <p>Address: {userData.address && `${userData.address.addressLine1} ${userData.address.addressLine2} ${userData.address.city}, ${userData.address.state} ${userData.address.zip}`}</p>                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export { BuildAdminTable, BuildUserTable };
