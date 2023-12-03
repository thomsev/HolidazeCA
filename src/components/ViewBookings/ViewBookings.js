import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { useAuth } from '../AuthContext/AuthContext'; 
import { API_BASE_URL } from '../../constants/apiConstants';
import { useNavigate } from 'react-router-dom';


function ViewBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const bookingsResponse = await axios.get(`${API_BASE_URL}/profiles/${user.name}/bookings`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleDeleteBooking = async (bookingId) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter out the deleted booking from the bookings state
      const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return <div>No bookings available.</div>;
  }

  return (
    <div className="viewBookingsContainer container">
      <h1 className="text-center mt-4">Your Bookings</h1>
      <div className="bookings-list">
        {bookings.map(booking => (
          <Card key={booking.id} className="mb-3">
            <Card.Body>
              <Card.Title>Booking on {booking.dateFrom}</Card.Title>
              <Card.Text>Guests: {booking.guests}</Card.Text>
              <button className="btn btn-danger" onClick={() => handleDeleteBooking(booking.id)}>Delete</button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ViewBookings;