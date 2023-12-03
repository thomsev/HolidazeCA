import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form'; // Import useForm
import { useAuth } from '../AuthContext/AuthContext';
import { API_BASE_URL } from '../../constants/apiConstants';
import './UserPage.css';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function UserPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]); // Add this line to declare the venues state
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const profileResponse = await axios.get(`${API_BASE_URL}/profiles/${user.name}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setProfile(profileResponse.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
  
    if (user && !profile) {
      fetchProfile();
    }
  }, [user, profile]);
  
  useEffect(() => {
    const fetchVenuesAndBookings = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (profile && accessToken) {
          // Fetch venues
          const venuesResponse = await axios.get(`${API_BASE_URL}/profiles/${profile.name}/venues`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          setVenues(venuesResponse.data);
          
          // Fetch bookings
          const bookingsResponse = await axios.get(`${API_BASE_URL}/profiles/${profile.name}/bookings`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          setBookings(bookingsResponse.data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    if (profile) {
      fetchVenuesAndBookings();
    }
  }, [profile]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const handleVenueClick = (venueId) => {
    navigate(`/venues/${venueId}`); // Navigate to the venue's page
  };
  
  const isDateBooked = (date) => {
    return bookings.some(booking => 
      date >= new Date(booking.dateFrom) && date <= new Date(booking.dateTo)
    );  
  };

  const handleAvatarSubmit = async (data) => {
    const token = localStorage.getItem('accessToken');
  
    try {
      // Send the avatar URL directly to the API to update the user profile
      const updateResponse = await fetch(`${API_BASE_URL}/profiles/${user.name}/media`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: data.avatarURL }) // data.avatarURL is the URL from the form input
      });
  
      if (!updateResponse.ok) {
        throw new Error('Failed to update profile');
      }
  
      const updateResult = await updateResponse.json();
      setProfile({ ...profile, avatar: data.avatarURL }); // Update the profile state with the new avatar URL
  
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleDeleteBooking = async (bookingId) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.status === 204) {
        throw new Error('Failed to delete booking');
      }

      // Filter out the deleted booking from the bookings state
      const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error:', error);
      // Here, add any error handling logic or user feedback
    }
  };

  const handleDeleteVenue = async (venueId) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.delete(`${API_BASE_URL}/venues/${venueId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.status === 204) {
        throw new Error('Failed to delete venue');
      }

      // Filter out the deleted venue from the venues state
      const updatedVenues = venues.filter(venue => venue.id !== venueId);
      setVenues(updatedVenues);
    } catch (error) {
      console.error('Error:', error);
      // Handle error here
    }
  };

  return (
    <div className="userPageContainer container">
      <h1 className="welcomeMessage text-center mt-4">Welcome, {profile?.name}!</h1>
  
      <div className="row">
      <div className="col-lg-4 mb-4">
        <Card className="h-100"> {/* Add h-100 for full height */}
          <Card.Body>
            <Card.Title>User Information</Card.Title>
            <Card.Img variant="top" src={profile.avatar} className="avatar-image mb-3" />
            <Card.Text><strong>Name:</strong> {profile.name}</Card.Text>
              <Card.Text><strong>Email:</strong> {profile.email}</Card.Text>
              <Card.Text><strong>Venue Manager:</strong> {profile.venueManager ? 'Yes' : 'No'}</Card.Text>
              <Card.Text><strong>Venues Count:</strong> {profile._count.venues}</Card.Text>
              <Card.Text><strong>Bookings Count:</strong> {profile._count.bookings}</Card.Text>
            </Card.Body>
          </Card>
        </div>
  
        <div className="col-lg-4 mb-4 d-flex align-items-start">
          <div className="flex-fill">
            <h2 className="text-center">Your Venues</h2>
            <div className="venues-list">
              {venues.map(venue => (
                  <Card key={venue.id} className="mb-2 clickable" onClick={() => handleVenueClick(venue.id)}>
                  <Card.Body>
                    <Card.Title>{venue.name}</Card.Title>
                    <Card.Text>Description: {venue.description}</Card.Text>
                    <button className="btn btn-danger" onClick={() => handleDeleteVenue(venue.id)}>Delete</button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
  
        <div className="col-lg-4 mb-4 d-flex align-items-start">
          <div className="flex-fill">
            <h2 className="text-center">Your Bookings</h2>
            <div className="bookings-list">
              {bookings.map(booking => (
                <Card key={booking.id} className="mb-2">
                  <Card.Body>
                    <Card.Title>Booking on {booking.dateFrom}</Card.Title>
                    <Card.Text>Guests: {booking.guests}</Card.Text>
                    <button className="btn btn-danger" onClick={() => handleDeleteBooking(booking.id)}>Delete</button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
   {/* Calendar section */}
      <div className="row justify-content-center my-4">
        <div className="col-md-8">
          <h2 className="text-center">Your Booking Calendar</h2>
          <div className="calendar-container">
            <Calendar
              tileClassName={({ date, view }) => 
                view === 'month' && isDateBooked(date) ? 'bookedDate' : null
              }
            />
          </div>
          </div>
          </div>
      <div className="row justify-content-center my-4">
      <div className="col-md-8">
        <form onSubmit={handleSubmit(handleAvatarSubmit)} className="text-center">
          <input
            type="url"
            {...register("avatarURL", { required: "Avatar URL is required." })}
            className="form-control mb-2"
            placeholder="Enter avatar URL"
          />
          {errors.avatarURL && <p className="error">{errors.avatarURL.message}</p>}
          <button type="submit" className="btn btn-primary">Update Avatar</button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default UserPage;
