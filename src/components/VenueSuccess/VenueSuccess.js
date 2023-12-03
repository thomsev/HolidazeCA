import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/apiConstants';
import './VenueSuccess.css';

function VenueSuccess() {
  const { id } = useParams(); // This gets the id from the URL
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    // Fetch the venue details using the ID from the URL
    const fetchVenueDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/venues/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch venue details');
        }
        const data = await response.json();
        setVenue(data); // Set the fetched data to the venue state
      } catch (error) {
        console.error('Error fetching venue details:', error);
      }
    };

    fetchVenueDetails();
  }, [id]);

  if (!venue) {
    return <div>Loading venue details...</div>;
  }

  // Once the venue data is fetched, render the venue details
  return (
    <div className="venue-success-container">
      <h1 className="venue-success-title">Venue Created Successfully!</h1>
      <div className="venue-success-detail">
        <h2>{venue.name}</h2>
        <p><span className="venue-success-label">Description:</span> {venue.description}</p>
        {venue.media && venue.media.map((url, index) => (
          <img key={index} src={url} alt={`Venue ${index}`} />
        ))}
        <p><span className="venue-success-label">Price:</span> {venue.price}</p>
        <p><span className="venue-success-label">Max Guests:</span> {venue.maxGuests}</p>
        {/* ... More details ... */}
      </div>
      <button onClick={() => navigate(`/dashboard/edit-venue/${venue.id}`)} className="venue-success-edit-button">Edit Venue
        </button>

      {/* Include a delete button if needed */}
    </div>
  );
}

export default VenueSuccess;