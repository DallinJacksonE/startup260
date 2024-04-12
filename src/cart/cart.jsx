import React, { useEffect, useState, useContext } from 'react';
import { ChatComponent } from '../chat/chatComponent.jsx';
import UserContext from './../UserContext.jsx';
import './cart.css';


export function Cart() {
  const [cart, setCart] = React.useState([]);
  const { user, setUser } = useContext(UserContext);
  const [total, setTotal] = React.useState(0);


  useEffect(() => {
    
    const fetchUser = async () => {
      const response = await fetch('/api/validate');
      if (response.status === 204) {
        console.log("Cart: ", cart)
        let newTotal = 0;
        cart.forEach(order => {
          if (!order.submitted) {
            let price = parseInt(order.card.price, 10);
            newTotal += price;
          }
        }
        );
        setTotal(newTotal);
      } else {
        console.log('User not found');
        const userResponse = await fetch('/api/secureUser');
        const userData = await userResponse.json();
        setUser(userData);
        setCart(userData.orders);
      }
    };
    fetchUser();
  }, [user]);

  


  const fetchCartItems = async () => {
    const response = await fetch('/api/secureUser');
    const user = await response.json();
    setCart(user.orders);
  };

  const removeFromCart = async (itemUniqueCode, clear = false) => {
    try {

      const response = await fetch('/api/secureUser');
      const user = await response.json();

      if (clear) {
        for (let i = 0; i < user.orders.length; i++) {
          if (user.orders[i].submitted === false) {
            user.orders.splice(i, 1);
            i--;
          }
        }
      } else {
        for (let i = 0; i < user.orders.length; i++) {
          if (user.orders[i].uniqueId === itemUniqueCode) {
            user.orders.splice(i, 1);
            break;
          }
        }
      }

      let jsonData = JSON.stringify(user);
      let response2 = await fetch('/api/updateUserOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

      console.log("Cart data update call: ", response2.status);


    } catch (error) {
      console.error('Error:', error);
    }
    fetchCartItems();
  };

  function UserCart({ cartState = [] }) {

    return (
      <>
        <h2>Your Cart</h2>
        <div className='container' id='checkoutCards-container'>
          {cartState.length > 0 ? cartState.map((order) => (
            order.submitted ? null : <CartItem key={order.uniqueId} order={order} />
          )) : <div>Your cart is empty</div>}
        </div>
        <hr />
        <h5>Total: ${total}</h5>
          <button className='btn btn-primary' onClick={submitCart}>
            Submit Cart
          </button>
          <button className='btn btn-danger' onClick={() => removeFromCart(null, true)}>
                Clear Cart
              </button>
      </>
    );
  }

  function CartItem({ order }) {


    return (
      <div className='card mb-3 w-100'>
        <div className='row g-0'>
          <div className='col-xxl-4'>
            <img className='img-fluid rounded-start mx-auto' src={order.card.picture} alt='...' />
          </div>
          <div className='col-xxl-8'>
            <div className='card-body'>
              <h5 className='card-title'>{order.card.title}</h5>
              <p className='card-text'>{order.card.description}</p>
              <p className='card-text'>${order.card.price}</p>
              <textarea
                className='form-control'
                id={order.uniqueId}
                placeholder='Comments'
              />
              <button className='btn btn-danger' onClick={() => removeFromCart(order.uniqueId)}>
                Remove from Cart
              </button>

            </div>
          </div>
        </div>
      </div>
    );
  }


  async function submitCart() {

    try {
      //wait for the payment to go through

      let response = await fetch('/api/secureUser');
      const user = await response.json();


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
          user.orders[i].shipped = false;
          user.orders[i].complete = false;
          user.orders[i].comments = '';

          //get comments from the text area
          let commentsElement = document.getElementById(user.orders[i].uniqueId);
          let enteredText = commentsElement.value;
          user.orders[i].comments = enteredText;
        }
      }

      let jsonData = JSON.stringify(user);
      let response2 = await fetch('/api/updateUserOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });
      console.log("Cart submitted data update call: ", response2.status);
      fetchCartItems();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  

  return (
    <main>
      <div className="columns-container">
        <div className="left-column">
        <h2>Chat With Kaylie</h2>
          <ChatComponent user={user} />
        </div>
        <div className='right-column' id='ticketForm'>
          <UserCart cartState={cart} />
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          Placing an Order
        </div>
        <div className="card-body">
          <blockquote className="blockquote mb-0">
            <p>Feel free to chat with me about any questions about available colors or options before placing your order.</p>
            <p>If you want to make small changes to the item (color, size, number of spots, etc.), or have any comments about the item, please write it in the comments box.</p>
            <p>If you want to make a custom order, please email Kaylie at <a href="mailto:kayliescreations30@gmail.com">kayliescreations30@gmail.com.</a></p>
            <p>If you want to make an order that is more than 6 items, please email Kaylie at <a href="mailto:kayliescreations30@gmail.com">kayliescreations30@gmail.com.</a></p>
            <p>Orders can take up to 14 days to ship, so plan with a maximum of 19 days from purchase to delivery.</p>
            <p>The chat is with the real Kaylie, not a bot, so response times won't be immediate. Feel free to email Kaylie with any more urgent or detailed matters.</p>

          </blockquote>
        </div>
      </div>
    </main>
  );
}

