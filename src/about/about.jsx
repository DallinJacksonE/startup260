import React from 'react';
import './about.css';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <main>
      <div className="card">
            <div id="card-header-about" className="card-header">
                About
            </div>
            <div className="card-body">
                <h5 className="card-title">The Beginning of Kaylie's Creations</h5>
                <img id="img-about" src="../../../pics/creations/yellowMonsterCowOrangeBat-min.jpg" className="rounded" alt="Some yellow plushies"/>

                <p className="card-text">At the end of 2019, at the age of 13, I decided (with the encouragement of my
                    family), that I should try my hand at running a business. I decided that I would try to sell my
                    crocheted plushies to friends and family. They were very popular, and from word of mouth, my
                    business expanded rapidly. I began an Instagram page, and with lots of work and practice, continued
                    to sell my creations and design my own patterns. I participated in a local craft fair, and loved the
                    experience. Here in 2024, you can find an assortment of hand-made creations on my website, on
                    Instagram, or at fairs in the Northern Colorado area.
                </p>
                <Link className="btn btn-primary" to="/shop">Check Out My Stock</Link>
            </div>
        </div>
    </main>
  );
}