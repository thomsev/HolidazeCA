import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext/AuthContext';
import Header from './components/Header/Header';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import HomePage from './components/Homepage/Homepage';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Venues from './components/Venues/Venues';
import VenueDetails from './components/VenueDetails/VenueDetails';
import NewVenue from './components/NewVenue/NewVenue';
import EditVenue from './components/EditVenue/EditVenue';
import ViewBookings from './components/ViewBookings/ViewBookings';
import ManagerDashboard from './components/ManangerDashboard/ManangerDashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import VenueSuccess from './components/VenueSuccess/VenueSuccess'; 
import UserPage from './components/UserPage/UserPage'; // Adjust the path as needed
import BookingComponent from './components/Booking/Booking';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import './App.css';


function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="site-content-wrapper">
          <Header />
          <Nav />
          <div className="site-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/About" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetails />} />
          <Route path="/venue-success/:id" element={<VenueSuccess />} />
          <Route path="/booking/:venueId" element={<BookingComponent />} />
          
          {/* Separate the /user route from the /dashboard nested routes */}
          <Route path="/user" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />

          {/* Protected Manager Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>}>
            <Route path="new-venue" element={<NewVenue />} />
            <Route path="edit-venue/:id" element={<EditVenue />} />
            <Route path="view-bookings" element={<ViewBookings />} />
          </Route>
        </Routes>
        </div>
        <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
