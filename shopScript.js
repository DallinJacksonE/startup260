// Dallin Jackson 2/14/24
// kayliescreations.biz
// classes:
// - shopClass:
//      takes the JSON list of shopCards and then defines a callable function that makes all the cards

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
        
    }

}

let shopCardsJson;
fetch('/shopCards.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(data => {
        shopCardsJson = data;
        let kayliesShop = new shop(shopCardsJson);
        let cards = kayliesShop.createCards();

        // Get the container where you want to display the cards
        let container = document.getElementById('cards-container');

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

        let cardButton = document.createElement('button');
        cardButton.className = 'btn btn-primary';
        cardButton.id = `${card.cardId}`;
        cardButton.textContent = 'Add to Ticket';

        // Add the title, description, and price to the card div
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardButton);
        cardClassDiv.appendChild(img);
        cardClassDiv.appendChild(cardBody);
        colClassDiv.appendChild(cardClassDiv);

        // Add the card div to the container
        container.appendChild(colClassDiv);
    });

    })
    .catch(error => {
        console.error('Error:', error);
    });
