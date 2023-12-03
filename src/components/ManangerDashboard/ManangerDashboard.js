import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/apiConstants';
import { useAuth } from '../AuthContext/AuthContext'; 
import './ManagerDashboard.css';
import MetaTags from '../MetaTags/MetaTags';
import { jwtDecode }  from 'jwt-decode';
import axios from 'axios';

function ManagerDashboard() {
  const { user } = useAuth();
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken'); 
    if (token && user && user.isVenueManager) {
      // Decode the JWT token to get user email and roles
      try {
        const decodedToken = jwtDecode(token);
        if (!decodedToken.isVenueManager) {
          setError(new Error("You are not authorized to view this page."));
          return;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setError(error);
        return;
      }

      axios.get(`${API_BASE_URL}/venues/managed-by/${user.id}?_owner=true&_bookings=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setVenues(response.data);
        const allBookings = response.data.reduce((acc, venue) => [...acc, ...(venue.bookings || [])], []);
        setBookings(allBookings);
      })
      .catch(error => {
        console.error('There was an error:', error);
        setError(error);
      });
    }
  }, [user]);

  if (error) {
    return <div>Error: {error.message}</div>; 
  }

  return (
    <div className="container mt-4">
      <MetaTags 
        title="Holidaze Admin - Manage Your Bookings and Venues"
        description="Holidaze admin portal for venue managers to register, manage venues, and oversee bookings. Simplifying venue management and booking processes."
        keywords="holidaze, admin, venue management, booking management, accommodation services, travel industry"
      />
      <h1>Manager Dashboard</h1>
      {user && user.isVenueManager ? (
        <div className="dashboard-layout">
          <div className="dashboard-venues">
            <h2>Your Managed Venues</h2>
            {venues.length > 0 ? venues.map(venue => (
              <div key={venue.id} className="venue-entry">
                <h3>{venue.name}</h3>
                {venue.media && venue.media.length > 0 && (
                  <img src={venue.media[0]} alt={venue.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                )}
                <p>{venue.description}</p>
              </div>
            )) : <p>No venues found.</p>}
          </div>
          <div className="dashboard-bookings">
            <h2>Bookings at Your Venues</h2>
            {bookings.length > 0 ? bookings.map(booking => (
              <div key={booking.id} className="booking-entry">
                <p>Booking ID: {booking.id}</p>
                <p>Date: {booking.date}</p>
              </div>
            )) : <p>No bookings found.</p>}
          </div>
        </div>
      ) : (
        <p>You must be a venue manager to access this dashboard.</p>
      )}
      <Outlet />
    </div>
  );
}

export default ManagerDashboard;