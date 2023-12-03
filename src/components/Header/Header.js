import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'; 

function Header() {
  return (
    <header className="header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
      <h1 className="header-title">Holidaze</h1>
      <div className="header-contact-info">
        <span className="header-phone">Call Us: 123-456-7890</span>
        <span className="header-email">Email: contact@holidaze.com</span>
      </div>
    </header>
  );
}

export default Header;
