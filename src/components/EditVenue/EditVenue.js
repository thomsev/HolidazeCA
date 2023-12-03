import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../../constants/apiConstants'; 
import './EditVenue.css';

function EditVenue() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [venue, setVenue] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVenue = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/venues/${id}`);
            if (!response.ok) {
              throw new Error(`Error fetching venue: ${response.statusText}`);
            }
            const venueData = await response.json();
            setVenue(venueData);
            
            Object.keys(venueData).forEach(key => {
              setValue(key, venueData[key]);
            });
            setLoading(false);
          } catch (error) {
            console.error('Fetch error:', error);
            navigate('/error'); 
          }
        };
      
        fetchVenue();
      }, [id, setValue, navigate]);
      

  const onSubmit = async (updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error(`Error updating venue: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Venue updated:', result);
      navigate(`/venue-success/${id}`); 
    } catch (error) {
      console.error('Update error:', error);
    }
  };


  
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
  
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 
          },
        });

        if (!response.ok) {
          throw new Error(`Error deleting venue: ${response.statusText}`);
        }

        navigate('/venues'); 
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };
  
  return (
    <div className="container">
      <h2>Create a New Venue</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Venue Name</label>
          <input className="form-control" {...register("name", { required: "Venue name is required." })} />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-control" {...register("description", { required: "Description is required." })} />
          {errors.description && <p className="error">{errors.description.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Media URL</label>
          <input className="form-control" type="url" {...register("media")} />
        </div>
        
        <div className="form-group">
          <label>Price</label>
          <input className="form-control" type="number" {...register("price", { required: "Price is required." })} />
          {errors.price && <p className="error">{errors.price.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Max Guests</label>
          <input className="form-control" type="number" {...register("maxGuests", { required: "Max guests is required." })} />
          {errors.maxGuests && <p className="error">{errors.maxGuests.message}</p>}
        </div>
        
        <div className="checkbox-group">
          <label>
            <input type="checkbox" {...register("wifi")} />
            Wifi
          </label>
          <label>
            <input type="checkbox" {...register("parking")} />
            Parking
          </label>
          <label>
            <input type="checkbox" {...register("breakfast")} />
            Breakfast
          </label>
          <label>
            <input type="checkbox" {...register("pets")} />
            Pets Allowed
          </label>
        </div>

        <div className="form-buttons">
        <button type="submit" className="btn btn-primary button">Save Changes</button>
        <button type="button" onClick={handleDelete} className="btn btn-danger button">Delete Venue</button>
      </div>
      </form>
    </div>
  );
}

export default EditVenue;