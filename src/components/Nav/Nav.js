import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../AuthContext/AuthContext'; // Adjust the import path as needed
import './Nav.css';
import { useNavigate } from 'react-router-dom';


function Navigation() {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();        // Your logout function that clears the user's session
    setExpanded(false);  // Any other state or UI cleanup
    navigate('/');  // Redirects to the homepage
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" expanded={expanded}>
      <Navbar.Brand as={Link} to="/">Holidaze</Navbar.Brand>
      <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/venues" onClick={() => setExpanded(false)}>Venues</Nav.Link>
          <Nav.Link as={Link} to="/about" onClick={() => setExpanded(false)}>About</Nav.Link>
        </Nav>
        {user ? (
          <>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard/new-venue" onClick={() => setExpanded(false)}>New Venue</Nav.Link>
              <Nav.Link as={Link} to="/user" onClick={() => setExpanded(false)}>User Page</Nav.Link>
              <Nav.Link as={Link} to="/dashboard/view-bookings" onClick={() => setExpanded(false)}>View Bookings</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
             <Button variant="danger" onClick={handleLogout} className="logout-button">Logout</Button>
            </Nav>
          </>
        ) : (
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login" onClick={() => setExpanded(false)}>Login</Nav.Link>
            <Nav.Link as={Link} to="/register" onClick={() => setExpanded(false)}>Register</Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;