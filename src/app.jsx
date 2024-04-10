import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { Home } from './home/home.jsx';
import { NavBar } from './navBar/navBar.jsx';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Auth } from './login/auth.jsx';
import { Cart } from './cart/cart.jsx';
import { About } from './about/about.jsx';
import { ShopComponent } from './shop/shop.jsx';

export default function App() {

    return (
        <BrowserRouter>
          <div className='body'>
            <header className='container-fluid'>
                <NavBar />
            </header>
    
            <Routes>
                <Route path='' element={<Home />} />
                <Route path='/shop' element={<ShopComponent />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/login' element={<Auth />} />
                <Route path='/about' element={<About />} />
                <Route path='*' element={<Home />} />
            </Routes>
    
            <footer className='bg-light text-dark text-muted'>
              <div className='container-fluid'>
                <span className='text-reset'>Created by D. Jackson </span>
                <a className='text-reset' href='https://github.com/DallinJacksonE/startup260'>
                  ( Source )
                </a>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      );
  }