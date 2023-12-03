import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/apiConstants'; 
import './NewVenue.css';

function NewVenue() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const token = localStorage.getItem('accessToken');
    const formattedData = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        maxGuests: Number(data.maxGuests),
        rating: data.rating ? Number(data.rating) : 0, 
        media: data.media ? [data.media] : [], 
        meta: {
          wifi: data.wifi || false,
          parking: data.parking || false,
          breakfast: data.breakfast || false,
          pets: data.pets || false
        },
        location: {
          address: data.address || "Unknown",
          city: data.city || "Unknown",
          zip: data.zip || "Unknown",
          country: data.country || "Unknown",
          continent: data.continent || "Unknown",
          lat: data.lat ? Number(data.lat) : 0, 
          lng: data.lng ? Number(data.lng) : 0  
        }
      };;

    try {
        const response = await fetch(`${API_BASE_URL}/venues`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(formattedData)
        });
  
        if (!response.ok) {
            const errorResponse = await response.json(); 
            console.error('Server Error:', errorResponse);
            throw new Error('Error creating venue');
          }
  
        const responseData = await response.json();
        console.log('Venue Created:', responseData);
        navigate(`/venue-success/${responseData.id}`); 
      } catch (error) {
        console.error('Error:', error);
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

        <button type="submit" className="btn btn-primary">Create Venue</button>
      </form>
    </div>
  );
}

export default NewVenue;
