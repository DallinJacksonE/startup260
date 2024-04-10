import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { Home } from './home/home.jsx';
import { NavBar } from './navBar/navBar.jsx';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login.jsx';
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
              <Route path='*' element={<Home />} />
            </Routes>
    
            <footer className='bg-dark text-dark text-muted'>
              <div className='container-fluid'>
                <span className='text-reset'>Author Name(s)</span>
                <a className='text-reset' href='https://github.com/webprogramming260/simon-react'>
                  Source
                </a>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      );
  }