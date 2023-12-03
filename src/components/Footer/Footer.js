import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css'; 

function Footer() {
  return (
    <footer className="footer bg-dark text-white text-center p-4">
      <div className="footer-content">
      <div className="footer-nav">
        <Link to="/" className="footer-link">Home</Link>
        <Link to="/venues" className="footer-link">Destinations</Link>
        <Link to="/venues" className="footer-link">Special Offers</Link>
        <Link to="/about" className="footer-link">About Us</Link>
        <Link to="/contact" className="footer-link">Contact</Link>
      </div>
        <div className="footer-social">
          <a href="https://www.facebook.com" className="social-link">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href="https://www.twitter.com" className="social-link">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://www.instagram.com" className="social-link">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
        <p className="footer-copy">© 2023 Holidaze. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
