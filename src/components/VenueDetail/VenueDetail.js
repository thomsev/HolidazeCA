import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function VenueDetail() {
  const navigate = useNavigate();
  const { venueId } = useParams(); 
  const [venue, setVenue] = React.useState(null);

  React.useEffect(() => {
    // Fetch the venue details when the component mounts
    const fetchVenueDetails = async () => {
      try {
        const response = await fetch(`YOUR_API_ENDPOINT_FOR_VENUE_DETAILS/${venueId}`);
        if (!response.ok) {
          throw new Error('Could not fetch venue details');
        }
        const data = await response.json();
        setVenue(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVenueDetails();
  }, [venueId]);

  const handleDelete = async () => {
    // Call the API to delete the venue
    try {
      const response = await fetch(`YOUR_API_ENDPOINT_FOR_DELETING_VENUE/${venueId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete the venue');
      }
      navigate('/venues'); 
    } catch (error) {
      console.error(error);
    }
  };

  if (!venue) {
    return <div>Loading...</div>;
  }

  return (
    <div className="venue-detail-container">
      <h2>{venue.name}</h2>
      <p>{venue.description}</p>
      <button onClick={() => navigate(`/edit-venue/${venueId}`)}>Edit Venue</button>
      <button onClick={handleDelete}>Delete Venue</button>
    </div>
  );
}

export default VenueDetail;
