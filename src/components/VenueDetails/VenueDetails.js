import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/apiConstants';
import './VenueDetails.css';
import { useAuth } from '../AuthContext/AuthContext';


function VenueDetails() {
  const [venue, setVenue] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();  

  useEffect(() => {
    const fetchVenueDetails = async () => {
      const response = await fetch(`${API_BASE_URL}/venues/${id}`);
      const data = await response.json();
      setVenue(data);
    };

    fetchVenueDetails();
  }, [id]);

  // Function to handle the booking button click
  const handleBookingClick = () => {
    if (user) {
      // User is logged in, proceed to booking
      navigate(`/booking/${id}`);
    } else {
      alert("You need to be registered and logged in to book a venue. Please login or register to continue.");
      navigate('/login'); 
    }
  };


  if (!venue) {
    return <div>Loading...</div>;
  }

  return (
    <div className="venue-details-container">
      <h1 className="venue-details-title">{venue.name}</h1>
      <img className="venue-details-image" src={venue.media[0]} alt={venue.name} />
      <p className="venue-details-description">{venue.description}</p>
      <button onClick={handleBookingClick} className="btn btn-primary">Book This Venue</button>
    </div>
  );
}

export default VenueDetails;
