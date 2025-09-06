import React from 'react';
import './home.css';
import { Carousel } from "react-bootstrap";
import { InstagramEmbed } from 'react-social-media-embed';


export function Home() {
  return (
    <main>
      {alert("This website is currently closed for orders, no accounts or shop items are available. Text Kaylie's Insta if you need a plush :)")}
      <Carousel>
        <Carousel.Item>
          <img src="../../../pics/creations/carousel/cowsingrass.jpeg" className="d-block w-100" alt="..." />
        </Carousel.Item>
        <Carousel.Item>
          <img src="../../../pics/creations/carousel/blankets.jpeg" className="d-block w-100" alt="..." />
        </Carousel.Item>
        <Carousel.Item>
          <img src="../../../pics/creations/carousel/pileofplushies.jpeg" className="d-block w-100" alt="..." />
        </Carousel.Item>
        <Carousel.Item>
          <img src="../../../pics/creations/carousel/rainbows.jpeg" className="d-block w-100" alt="..." />
        </Carousel.Item>
      </Carousel>

      <div className="columns-container">
        <div className="left-column">
          <h3>Yarn Come to Life</h3>
          <p id="frontpagelefttext" className="fs-4">Welcome to my website! I am Kaylie, the founder of Kaylie's Creations. I am so happy you decided to visit. Please take a look through the shop, and if you see anything you'd like to buy, feel free to login and place an order!
          </p>

        </div>
        <div className="right-column">
          <div id="instagram">
            <h3>Instagram</h3>
            <div id="inner-insta">
              <InstagramEmbed url="https://www.instagram.com/p/C5bu31AucQi/" />
            </div>
          </div>
        </div>
      </div>


    </main>
  );
}
