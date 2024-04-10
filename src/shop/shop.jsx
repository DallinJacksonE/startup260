import React, { useEffect, useState } from 'react';

//Classes
class Shop {
  constructor(shopCards) {
    this.shopCards = shopCards;
  }

  createCards() {
    return this.shopCards.map(cardData => new ShopCardData(cardData));
  }
}

class ShopCardData {
  constructor(cardData) {
    this.title = cardData.title;
    this.description = cardData.description;
    this.price = cardData.price;
    this.cardId = cardData.cardId;
    this.picture = cardData.picture;
    this.stock = cardData.stock;
    this.readyToShip = cardData.readyToShip;
  }
}

//Components
function ShopCardComponent({ card, addToCart }) {
  const cardStockStyle = card.readyToShip ? { color: 'green' } : { color: 'grey' };
  const cardStockText = card.readyToShip ? 'Ready to Ship' : 'Made to Order';

  return (
    <div className="col">
      <div className="card">
        <img src={card.picture} alt={card.title} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{`${card.title} - $${card.price}`}</h5>
          <h6 className="card-stock" style={cardStockStyle}>{cardStockText}</h6>
          <p className="card-text">{card.description}</p>
          <button className="btn btn-primary" id={card.cardId} onClick={() => addToCart(card)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}


//main Component
export  function ShopComponent() {
  const [shop, setShop] = useState(null);
  const [validUser, setValidUser] = useState(false);

  useEffect(() => {
    async function loadShop() {
      try {
        const response = await fetch('/api/getShopCards');
        const shopCardsJson = await response.json();
    
        if (Array.isArray(shopCardsJson)) {
          const newShop = new Shop(shopCardsJson);
          setShop(newShop);
        } else {
          console.error('shopCardsJson is not an array:', shopCardsJson);
        }
    
        const validUser = await fetch('/api/validate');
        setValidUser(validUser.ok);
    
      } catch (error) {
        console.error('Error:', error);
      }
    }

    loadShop();
  }, []);

  if (!shop) {
    return <div>Loading...</div>;
  }

  function generateCode() {
    return Math.random().toString(36).substring(2, 7);
  }

  async function addToCart(shopCard) {
      try {

          let userResponse = await fetch('/api/secureUser');
          let user = await userResponse.json();
          console.log("User: ", user);

          let itemUniqueCode = generateCode();
          let newItem = { productId: shopCard.cardId, uniqueId: itemUniqueCode, submitted: false, card: shopCard}
          user.orders.push(newItem);

          let response2 = await fetch('/api/updateUserOrders', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(user)
          });
          
          console.log("Updated Cart: ", response2.status);

      } catch (error) {
          console.error('Error:', error);
      }
      
  }
  
  if (validUser) {
    return ( //user view of shop
      <div className="row row-cols-1 row-cols-md-2 g-4" id="cards-container">
        {shop.createCards().map(card => (
          <ShopCardComponent key={card.cardId} card={card} addToCart={addToCart} />
        ))}
      </div>
    );
  } else {
    return ( //guest view of shop
      <div className="row row-cols-1 row-cols-md-2 g-4" id="cards-container">
        {shop.createCards().map(card => (
          <ShopCardComponent key={card.cardId} card={card} addToCart={addToCart} />
        ))}
      </div>
    );
  }

}

