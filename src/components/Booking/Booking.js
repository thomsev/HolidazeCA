import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/apiConstants';
import VenueCalendar from '../Calendar/Calendar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './Booking.css';
import { jwtDecode } from 'jwt-decode'; 

function BookingComponent() {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [bookedDates] = useState([]); 

  const token = localStorage.getItem('accessToken'); // access token from local storage

  useEffect(() => {
    if (venueId && token) {
      // JWT token to get user email
      try {
        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.error('Error decoding token:', error);
      }

      // Fetch venue details and booked dates
      axios.get(`${API_BASE_URL}/venues/${venueId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setVenue(response.data);
      })
      .catch(error => {
        console.error('There was an error:', error);
      });
    }
  }, [venueId, token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const [dateFrom, dateTo] = selectedDates; 

    const bookingData = {
      venueId: venueId,
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      guests: Number(numberOfGuests),
      customerEmail: userEmail
    };

    axios.post(`${API_BASE_URL}/bookings`, bookingData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setIsSubmitting(false);
      setBookingResult('Booking successful!');
    })
    .catch(error => {
      setIsSubmitting(false);
      const errorMessage = error.response?.data?.errors[0]?.message || 'An unknown error occurred';
      setBookingResult(`Booking failed: ${errorMessage}`);
    });
  };

  const handleDateChange = (range) => {
    setSelectedDates(range);
    const [start, end] = range;
    const newHighlightedDates = [];

    if (start && end) {
      for (let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        newHighlightedDates.push(dt.toISOString().split('T')[0]);
      }
    }

    setHighlightedDates(newHighlightedDates);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Make a Booking</h1>
      <form onSubmit={handleSubmit}>
        {venue && (
          <div className="form-group">
            <label>Venue:</label>
            <input type="text" className="form-control" value={venue.name} disabled />
          </div>
        )}
        <div className="form-group">
          <label>Date Range:</label>
          <VenueCalendar
  onChange={handleDateChange}
  selectedDates={selectedDates}
  bookedDates={bookedDates}
  highlightedDates={highlightedDates}
/>
        </div>
        <div className="form-group">
          <label>Number of Guests:</label>
          <input 
            type="number" 
            className="form-control" 
            value={numberOfGuests} 
            onChange={e => setNumberOfGuests(Number(e.target.value))}
            min="1"
          />
        </div>
        <div className="form-group">
          <label>User Email:</label>
          <input 
            type="email" 
            className="form-control" 
            value={userEmail} 
            disabled
          />
        </div>
        <button type="submit" className={`btn ${isSubmitting ? 'btn-secondary disabled' : 'btn-primary'}`} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Booking'}
        </button>
      </form>
      {bookingResult && (
        <div className={`alert ${bookingResult.includes('successful') ? 'alert-success' : 'alert-danger'}`} role="alert">
          {bookingResult}
        </div>
      )}
    </div>
  );
}

export default BookingComponent;
