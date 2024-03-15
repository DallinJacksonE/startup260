// Dallin Jackson 2/14/24
// kayliescreations.biz

class shop {
    constructor(shopCardsJson) {
        this.shopCards = shopCardsJson;
    }

    createCards() {
        return this.shopCards.map(card => new shopCard(card));
    }

}

class shopCard {
    constructor(cardData) {
        this.title = cardData.title;
        this.description = cardData.description;
        this.price = cardData.price;
        this.cardId = cardData.cardId;
        this.picturePath = cardData.picturePath
        this.stock = cardData.stock;
        
    }

}


async function loadShop() {

    try {

    const response = await fetch('/api/getShopCards');
    console.log("Response: ", response);
    const shopCardsJson = await response.json();

    console.log("Got Shop cards: ", shopCardsJson);


    let kayliesShop = new shop(shopCardsJson);
    let cards = kayliesShop.createCards();
    let user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
    // Get the container where you want to display the cards
    let container = document.getElementById('cards-container');

        
    if (user) {
        cards.forEach(card => {
        
            // Create elements for the card's title, description, and price
            let colClassDiv = document.createElement('div');
            colClassDiv.className = 'col';
    
            //makes card class div where data is stored
            let cardClassDiv = document.createElement('div');
            cardClassDiv.className = 'card';
    
            let img = document.createElement('img');
            img.src = card.picturePath;
            img.alt = card.title;
            img.className = 'card-img-top';
    
            let cardBody = document.createElement('div');
            cardBody.className = 'card-body';
    
            let cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = `${card.title} - $${card.price}`;

            let cardStockText = document.createElement('h6');
            cardStockText.className = 'card-stock';
            if (card.readyToShip === false) {
                cardStockText.textContent = `Made to Order`;
                cardStockText.style = 'color: grey;';
            } else {
                cardStockText.textContent = ``;
                cardStockText.style = 'color: green;';
            }
            
    
            let cardText = document.createElement('p');
            cardText.className = 'card-text';
            cardText.textContent = card.description;
    
            let cardButton = document.createElement('button');
            cardButton.className = 'btn btn-primary';
            cardButton.id = `${card.cardId}`;
            cardButton.textContent = 'Add to Cart';
            cardButton.onclick = function() {
                addToCart(card);
            };
    
            // Add the title, description, and price to the card div
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardStockText);
            cardBody.appendChild(cardText);
            cardBody.appendChild(cardButton);
            cardClassDiv.appendChild(img);
            cardClassDiv.appendChild(cardBody);
            colClassDiv.appendChild(cardClassDiv);
    
            // Add the card div to the container
            container.appendChild(colClassDiv);
        });
    } else {
        cards.forEach(card => {
        
            // Create elements for the card's title, description, and price
            let colClassDiv = document.createElement('div');
            colClassDiv.className = 'col';
    
            //makes card class div where data is stored
            let cardClassDiv = document.createElement('div');
            cardClassDiv.className = 'card';
    
            let img = document.createElement('img');
            img.src = card.picturePath;
            img.alt = card.title;
            img.className = 'card-img-top';
    
            let cardBody = document.createElement('div');
            cardBody.className = 'card-body';
    
            let cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = `${card.title} - $${card.price}`;
    
            let cardText = document.createElement('p');
            cardText.className = 'card-text';
            cardText.textContent = card.description;
    
    
            // Add the title, description, and price to the card div
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardClassDiv.appendChild(img);
            cardClassDiv.appendChild(cardBody);
            colClassDiv.appendChild(cardClassDiv);
            // Add the card div to the container
            container.appendChild(colClassDiv);
        });
    }

    } catch (error) {
        console.error('Error:', error);
    }
}

function generateCode() {
    return Math.random().toString(36).substring(2, 7);
}

async function addToCart(shopCard) {
    try {

        let loggedInUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
        let response = await fetch('/api/safeUserData');
        let userData = await response.json();
        let user = userData.find(user => user.email === loggedInUser.email);
        console.log("User: ", user);

        let itemUniqueCode = generateCode();
        let newItem = { productId: shopCard.cardId, uniqueId: itemUniqueCode, submitted: false, card: shopCard}
        user.orders.push(newItem);

        let response2 = await fetch('/api/updateUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        let data = await response2.json();
        console.log("Updated Cart: ", data);

    } catch (error) {
        console.error('Error:', error);
    }
    
}

loadShop();