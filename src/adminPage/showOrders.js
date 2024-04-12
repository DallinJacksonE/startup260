// Dallin Jackson 3/12/24
// kayliescreations.biz


async function buildUserTable() {

    try {
        
        let userTable = document.getElementById('userEndOrders');
        if (userTable === null) {
            return;
        } 
        userTable.innerHTML = '';

        let loggedUser = await fetch('/api/secureUser');
        let loggedInUser = await loggedUser.json();

        let userCard = createCard(loggedInUser, true);

        userTable.appendChild(userCard);

    } catch (error) {
        console.log(error)
    }



}

export async function buildAdminTable() {
    // get data from api call
    try {
        const response = await fetch('/api/adminAccess');
        const allUsersData = await response.json();
        console.log('Admin table data call returned: ', allUsersData);

        let adminTable = document.getElementById('orders');
        if (adminTable === null) {
            return;
        }
        adminTable.innerHTML = '';

        allUsersData.forEach(user => {
            if (user.orders) {
                let userCard = createCard(user);
                adminTable.appendChild(userCard);
            }

        });

    } catch (error) {
        console.log(error)
    }



    // for each user, create a card with their orders table

}

async function updateOrderData(userData, call, id) {
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

        buildAdminTable();
        buildUserTable();
        
        
    } catch (error) {
        console.error('Error:', error);
    }

    
    
}

function buildTable(userData, userEnd = false) {
    let table = document.createElement('table');
    table.className = 'table';
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');
    tr.style.display = 'flex';
    

    let th = document.createElement('th');
    th.style.flex = '.75';
    th.style.padding = '1px';
    th.textContent = "Order ID";
    tr.appendChild(th);

    th = document.createElement('th');
    th.style.flex = '1.1';
    th.style.padding = '1px';
    th.textContent = "Item";
    tr.appendChild(th);

    th = document.createElement('th');
    th.style.flex = '1';
    th.style.padding = '1px';
    th.textContent = "Date Ordered";
    tr.appendChild(th);

    th = document.createElement('th');
    th.style.flex = '1.15';
    th.style.padding = '1px';
    th.textContent = "Comments";
    tr.appendChild(th);

    th = document.createElement('th');
    th.style.flex = '1';
    th.style.padding = '1px';
    th.textContent = "Created";
    tr.appendChild(th);

    th = document.createElement('th');
    th.style.flex = '1';
    th.style.padding = '1px';
    th.textContent = "Shipped";
    tr.appendChild(th);

    if (!userEnd) {
        th = document.createElement('th');
        th.style.padding = '1px';
        th.style.flex = '1';
        th.textContent = "Finish Order";
        tr.appendChild(th);

        th = document.createElement('th');
        th.style.padding = '1px';
        th.style.flex = '1';
        th.textContent = "Complete Shipping";
        tr.appendChild(th);
    }

    thead.appendChild(tr);
    table.appendChild(thead);

    userData.orders.forEach(order => {

        if (order.shipped === false) {
            //build the table
            let tr = document.createElement('tr');
            tr.style.display = 'flex';

            let td = document.createElement('td');
            td.style.flex = '.75';
            td.textContent = order.uniqueId;
            tr.appendChild(td);

            td = document.createElement('td');
            td.style.flex = '1.1';
            td.textContent = order.card.title;
            tr.appendChild(td);

            td = document.createElement('td');
            td.style.flex = '1';
            td.textContent = order.dateSubmitted;
            tr.appendChild(td);

            td = document.createElement('td');
            td.style.flex = '1.5';
            if (order.comments === "") {
                order.comments = 'None';
            }   
            td.textContent = order.comments;
            
            td.style.maxHeight = '100px'; // Set the maximum height
            td.style.overflowY = 'auto'; // Enable vertical scrolling
            td.style.maxWidth = '200px'; // Set the maximum width
            tr.appendChild(td);

            td = document.createElement('td');
            td.style.flex = '1';
            td.textContent = "In Progress";
            td.style.color = 'orange';
            if (order.complete === true) {
                td.textContent = "Completed";
                td.style.color = 'green';
            }
            
            tr.appendChild(td);

            td = document.createElement('td');
            td.style.flex = '1';
            td.textContent = "Pending";
            td.style.color = 'orange';
            if (order.shipped === true) {
                td.textContent = "True";
                td.style.color = 'green';
            }
            tr.appendChild(td);

            if (!userEnd) {
                td = document.createElement('td');
                td.style.flex = '1';
                let completeButton = document.createElement('button');
                completeButton.className = 'btn btn-outline-primary';
                completeButton.textContent = 'Complete';
                completeButton.onclick = function() {
                    updateOrderData(userData, 'finishOrder', order.uniqueId);
                }
                td.appendChild(completeButton);
                tr.appendChild(td);

                td = document.createElement('td');
                td.style.flex = '1';
                let shippedButton = document.createElement('button');
                shippedButton.className = 'btn btn-outline-success';
                shippedButton.textContent = 'Shipped';
                shippedButton.onclick = function() {
                    updateOrderData(userData, 'markShipped', order.uniqueId);
                }
                td.appendChild(shippedButton);
                tr.appendChild(td);
        }

            table.appendChild(tr);
        }

    });


    return table;
}


function createCard(userData, userEnd = false) {
    // create a card with user name and order table
    let cardDiv = document.createElement('div');
    cardDiv.className = 'card w-100';
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardBody.id = userData.email;
    let cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = userData.firstName + ' ' + userData.lastName;
    //append to parent
    cardDiv.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    //create table
    let table = buildTable(userData, userEnd);

    cardBody.appendChild(table);
    //create the accordian
    let pastOrdersAccordian = createPastOrdersAccordian(userData, userEnd); 

    cardBody.appendChild(pastOrdersAccordian);
    
    return cardDiv;
}


function createPastOrdersAccordian(userData, userEnd = false) {

    let id = userData.email.replace(/\./g, '-').replace(/@/g, '-');

    let pastOrdersAccordian = document.createElement('div');
    pastOrdersAccordian.className = 'accordion';
    pastOrdersAccordian.id = id + 'PastOrders';

    let item = document.createElement('div');
    item.className = "accordian-item"; 
    
    let header = document.createElement('h5');
    header.className = "accordion-header";

    let button = document.createElement('button');
    button.className = "accordion-button collapsed";
    button.type = "button";
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', '#' + id + 'PastOrdersCollapse');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', id + 'PastOrdersCollapse');
    button.textContent = "Past Orders";

    let collapse = document.createElement('div');
    collapse.className = "accordion-collapse collapse";
    collapse.id = id + 'PastOrdersCollapse';
    collapse.setAttribute('aria-labelledby', id + 'PastOrders');
    collapse.setAttribute('data-bs-parent', '#' + id + 'PastOrders');

    let body = document.createElement('div');
    body.className = "accordion-body";

    let pastOrdersTable = document.createElement('table');
    pastOrdersTable.className = "table";
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    th.textContent = "Order ID";
    tr.appendChild(th);

    th = document.createElement('th');
    th.textContent = "Item Name";
    tr.appendChild(th);

    th = document.createElement('th');
    th.textContent = "Date Shipped";
    tr.appendChild(th);

    
    th = document.createElement('th');
    th.textContent = "Shipped";
    tr.appendChild(th);

    if (!userEnd) {
        th = document.createElement('th');
        th.textContent = "Mark Unshipped";
        tr.appendChild(th);
    }

    thead.appendChild(tr);
    pastOrdersTable.appendChild(thead);

    let tbody = document.createElement('tbody');
    pastOrdersTable.appendChild(tbody);


    body.appendChild(pastOrdersTable);
    collapse.appendChild(body);
    item.appendChild(header);
    header.appendChild(button);
    item.appendChild(collapse);
    pastOrdersAccordian.appendChild(item);

    userData.orders.forEach(order => {
        if (order.shipped === true) {

            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = order.uniqueId;
            tr.appendChild(td);

            td = document.createElement('td');
            td.textContent = order.card.title;
            tr.appendChild(td);

            td = document.createElement('td');
            td.textContent = order.dateShipped;
            tr.appendChild(td);

            td = document.createElement('td');
            td.textContent = "Pending";
            td.style.color = 'orange';
            if (order.complete === true) {
                td.textContent = "Completed";
                td.style.color = 'green';
            }
            tr.appendChild(td);

            if (!userEnd) {
                td = document.createElement('td');
                let unshippedButton = document.createElement('button');
                unshippedButton.className = 'btn btn-outline-danger';
                unshippedButton.textContent = 'Unship';
                unshippedButton.onclick = function() {
                    updateOrderData(userData, 'markUnshipped', order.uniqueId);
                }
                td.appendChild(unshippedButton);
                tr.appendChild(td);
        }

            tbody.appendChild(tr);
        }
        
    });

    //add an accordian page with the user's shipping information and email
    let shippingInfo = document.createElement('div');
    shippingInfo.className = 'accordion';
    shippingInfo.id = id + 'ShippingInfo';

    item = document.createElement('div');
    item.className = "accordian-item";

    header = document.createElement('h5');
    header.className = "accordion-header";

    button = document.createElement('button');
    button.className = "accordion-button collapsed";
    button.type = "button";
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', '#' + id + 'ShippingInfoCollapse');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', id + 'ShippingInfoCollapse');
    button.textContent = "Shipping Information";

    collapse = document.createElement('div');
    collapse.className = "accordion-collapse collapse";
    collapse.id = id + 'ShippingInfoCollapse';
    collapse.setAttribute('aria-labelledby', id + 'ShippingInfo');
    collapse.setAttribute('data-bs-parent', '#' + id + 'ShippingInfo');

    body = document.createElement('div');
    body.className = "accordion-body";

    let email = document.createElement('p');
    email.textContent = "Email: " + userData.email;

    let address = document.createElement('p');
    address.textContent = "Address: " + userData.address.addressLine1 + " " + userData.address.addressLine2 + " " + userData.address.city + ", " + userData.address.state + " " + userData.address.zip;

    body.appendChild(email);
    body.appendChild(address);
    collapse.appendChild(body);
    item.appendChild(header);
    header.appendChild(button);
    item.appendChild(collapse);
    shippingInfo.appendChild(item);

    pastOrdersAccordian.appendChild(shippingInfo);

    return pastOrdersAccordian;
}


buildAdminTable();
buildUserTable();