import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import NavBar from './navBar/navBar.jsx';


export default function App() {
    return (
      <div className='body bg-light text-dark'>
        <header>
        
        </header>
  
        <main>App components go here</main>
  
        <footer className='bg-dark text-white-50'>
          <div className='container-fluid'>
            <span className='text-reset'>Author Name(s)</span>
            <a className='text-reset' href='https://github.com/webprogramming260/simon-react'>
              Source
            </a>
          </div>
        </footer>
      </div>
    );
  }