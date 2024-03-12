// Dallin Jackson 3/11/24
// kayliescreations.biz

let loggedInUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));


async function removeFromCart(itemUniqueCode, clear = false) {
    try {

        const response = await fetch('/api/safeUserData');
        const userData = await response.json();

        let user = userData.find(user => user.email === loggedInUser.email);

        if (clear) {
            user.orders = [];
        } else {    
            for (let i = 0; i < user.orders.length; i++) {
                if (user.orders[i].uniqueId === itemUniqueCode) {
                    user.orders.splice(i, 1);
                    break;
                }
            }
        }

        let jsonData = JSON.stringify(user);
        let response2 = await fetch('/api/updateUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData,
        });
        let data = await response2.json();
        console.log("Cart data update call: ", data.success);

        displayCart();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function submitCart() {

    try {
        let response = await fetch('/api/safeUserData');
        let userData = await response.json();
        let user = userData.find(user => user.email === loggedInUser.email);

        let currentDate = new Date();
        let dueDate = new Date();
        dueDate.setDate(currentDate.getDate() + 14); // Add 14 days to the current date

        let timeStamp = currentDate.getMonth() + 1 + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
        let dueDateString = dueDate.getMonth() + 1 + "/" + dueDate.getDate() + "/" + dueDate.getFullYear();


        for (let i = 0; i < user.orders.length; i++) {
            if (user.orders[i].submitted === false) {
                user.orders[i].submitted = true;
                user.orders[i].dateSubmitted = timeStamp;
                user.orders[i].dateDue = dueDateString;

                //get comments from the text area
                let commentsElement = document.getElementById(user.orders[i].uniqueId);
                let enteredText = commentsElement.value;
                user.orders[i].comments = enteredText;
            }
        }

        let jsonData = JSON.stringify(user);
        let response2 = await fetch('/api/updateUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData,
        });
        let data = await response2.json();
        console.log("Cart submitted data update call: ", data.success);
        
        displayCart();

    } catch (error) {
        console.error('Error:', error);
    }
    
    

}

async function displayCart() {
    try {

        const response = await fetch('/api/safeUserData');
        const userData = await response.json();

        let user = userData.find(user => user.email === loggedInUser.email);

        let ticketForm = document.getElementById('ticketForm');
        ticketForm.innerHTML = '';

        let title = document.createElement('h2');
        title.textContent = 'Cart';
        ticketForm.appendChild(title);

        let cartContainer = document.createElement('div');
        cartContainer.className = 'container';
        cartContainer.id = 'checkoutCards-container';
        cartContainer.style.borderLeft = '1px dashed grey';
    
        ticketForm.appendChild(cartContainer);

        console.log(user);
        console.log(user.orders);
        if (user.orders.length > 0) {
            let trueCount = 0;
            for (let i = 0; i < user.orders.length; i++) {
                if (user.orders[i].submitted === false) {
                    let cardDiv = document.createElement('div');
                    cardDiv.className = 'card mb-3 w-100';
                    let rowDiv = document.createElement('div');
                    rowDiv.className = 'row g-0';

                    let colDiv = document.createElement('div');
                    colDiv.className = 'col-xxl-4';

                    let img = document.createElement('img');
                    img.src = user.orders[i].card.picturePath;
                    img.alt = user.orders[i].card.title;
                    //img.style.minWidth = '195px'; 
                    img.className = 'img-fluid rounded-start mx-auto';

                    colDiv.appendChild(img);
                    rowDiv.appendChild(colDiv);
                    cardDiv.appendChild(rowDiv);

                    let colDiv2 = document.createElement('div');
                    colDiv2.className = 'col-xxl-8';
                    let cardBody = document.createElement('div');
                    cardBody.className = 'card-body';

                    let title = document.createElement('h5');
                    title.className = 'card-title';
                    title.textContent = user.orders[i].card.title;
                    cardBody.appendChild(title);

                    let description = document.createElement('p');
                    description.className = 'card-text';
                    description.textContent = user.orders[i].card.description;
                    cardBody.appendChild(description);


                    let price = document.createElement('p');
                    price.className = 'card-text';
                    price.textContent = "$" + user.orders[i].card.price;
                    cardBody.appendChild(price);

                    let comments = document.createElement('textarea');
                    comments.className = 'form-control';
                    comments.id = user.orders[i].uniqueId;
                    comments.placeholder = 'Comments';
                    cardBody.appendChild(comments);

                    let removeButton = document.createElement('button');
                    removeButton.className = 'btn btn-danger';
                    removeButton.textContent = 'Remove';
                    removeButton.onclick = function() {
                        removeFromCart(user.orders[i].uniqueId);
                    }
                    cardBody.appendChild(removeButton);

                    colDiv2.appendChild(cardBody);
                    rowDiv.appendChild(colDiv2);
                    cardDiv.appendChild(rowDiv);
                    cartContainer.appendChild(cardDiv);

                } else {
                    trueCount++;
                }

            }

            if (trueCount === user.orders.length) {
                let emptyCart = document.createElement('h5');
                emptyCart.textContent = 'Your cart is empty, add some items to it in the Shop!';
                cartContainer.appendChild(emptyCart);
            } else {
                let dividerLine = document.createElement('hr');
                ticketForm.appendChild(dividerLine);

                let submitButton = document.createElement('button');
                submitButton.className = 'btn btn-primary';
                submitButton.textContent = 'Submit Order';
                submitButton.onclick = function() {
                    submitCart();
                }
    
                ticketForm.appendChild(submitButton);
    
                let clearButton = document.createElement('button');
                clearButton.className = 'btn btn-danger';
                clearButton.textContent = 'Clear Cart';
                clearButton.onclick = function() {
                    removeFromCart(null, true);
                }
                ticketForm.appendChild(clearButton);

            }


        } else {
            let emptyCart = document.createElement('h5');
            emptyCart.textContent = 'Your cart is empty, add some items to it in the Shop!';
            cartContainer.appendChild(emptyCart);
        }


    } catch (error) {
        console.error('Error:', error);
    } 

}


displayCart();