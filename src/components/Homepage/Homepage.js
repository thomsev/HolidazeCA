import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/apiConstants';
import './Homepage.css';
import MetaTags from '../MetaTags/MetaTags';

function HomePage() {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/venues`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        data.sort((a, b) => new Date(b.created) - new Date(a.created));
        setVenues(data);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setError(error.message);
      }
    };

    fetchVenues();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const previewVenues = venues.slice(0, 6);

  return (
    
    <div className="container mt-4">
        <MetaTags 
        title="Holidaze - Discover Unique Venues for Your Events"
        description="Explore and book unique venues for your next event with Holidaze. Whether you are planning a wedding, conference, or party, find the perfect venue here."
        keywords="venues, events, booking, weddings, conferences, parties, Holidaze"/>
      <h1 className="text-center mb-3">Welcome to Holidaze</h1>
      <p className="text-center mb-4">
        Discover unique venues for your next event. <Link to="/register">Register</Link> or <Link to="/login">Login</Link> to start booking.
      </p>
      <div className="row">
        {previewVenues.map(venue => (
          <div key={venue.id} className="col-md-4 mb-3">
            <div className="card venue-card h-100">
              <img src={venue.media[0]} className="card-img-top venue-image" alt={venue.name} />
              <div className="card-body">
                <h5 className="card-title venue-name">{venue.name}</h5>
                <p className="card-text venue-description">{truncateText(venue.description, 20)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <Link to="/venues" className="btn btn-primary">View All Venues</Link>
      </div>
    </div>
  );
}

export default HomePage;

function truncateText(text, wordLimit) {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
}
