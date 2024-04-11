import React from 'react';
import './home.css';
import { Carousel } from "react-bootstrap";
import { InstagramEmbed } from 'react-social-media-embed';


export function Home() {
  return (
    <main>
      <Carousel>
      <Carousel.Item>
        <img src="../../../pics/creations/carousel/cowsingrass.jpeg" className="d-block w-100" alt="..."/>
      </Carousel.Item>
      <Carousel.Item>
        <img src="../../../pics/creations/carousel/blankets.jpeg" className="d-block w-100" alt="..."/>
      </Carousel.Item>
      <Carousel.Item>
        <img src="../../../pics/creations/carousel/pileofplushies.jpeg" className="d-block w-100" alt="..."/>
      </Carousel.Item>
      <Carousel.Item>
        <img src="../../../pics/creations/carousel/rainbows.jpeg" className="d-block w-100" alt="..."/>
      </Carousel.Item>
    </Carousel>
      
      <div className="columns-container">
        <div className="left-column">
              <h3>Yarn Come to Life</h3>
              <p id="frontpagelefttext" className="fs-4">Welcome to my website! I am Kaylie, the founder of Kaylie's Creations. I am so happy you decided to visit. Please take a look through the shop and enjoy!
              </p>

        </div>
        <div className="right-column">
            <h3>Upcoming Shows</h3>
            <table width="100%" className="table table-striped">
              <tbody>
                <tr id="show-table">
                  <th>Date</th>
                  <th>Location</th>
                  <th>Address</th>
                </tr>
                <tr>
                  <td>April 6</td>
                  <td>Cherokee Trail Spring Craft Fair</td>
                  <td>25901 E Arapahoe Rd, Aurora, CO 80016</td>
                </tr>
                <tr>
                  <td>April 13</td>
                  <td>Berthoud Spring Craft Fair, Berthoud Rec Center</td>
                  <td>1000 Berthoud Pkwy, Berthoud, CO 80513</td>
                </tr>
              </tbody>
            </table>
        </div>

      </div>
        <div id="instagram">
        <h3>Instagram</h3>
            <div id="inner-insta">
              <InstagramEmbed url="https://www.instagram.com/p/C5bu31AucQi/" />
            </div>
        </div>
      
    </main>
  );
}