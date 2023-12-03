import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/apiConstants';
import Pagination from '../Pagination/Pagination'; 

function Venues() {
  const [venues, setVenues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [venuesPerPage, setVenuesPerPage] = useState(10);
  const [filter, setFilter] = useState('');
  const [filteredVenues, setFilteredVenues] = useState([]);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch(`${API_BASE_URL}/venues`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setVenues(data);
        setFilteredVenues(data); // Initialize filteredVenues with all venues
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    }
    fetchVenues();
  }, []);

  function truncateText(text, wordLimit) {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  }
  

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
    if (!value) {
      setFilteredVenues(venues);
    } else {
      const filtered = venues.filter(venue =>
        venue.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredVenues(filtered);
    }
  };

  const displayList = useMemo(() => {
    return filter ? filteredVenues : venues;
  }, [filter, filteredVenues, venues]);

  const currentVenues = useMemo(() => {
    const indexOfLastVenue = currentPage * venuesPerPage;
    const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
    return displayList.slice(indexOfFirstVenue, indexOfLastVenue);
  }, [currentPage, venuesPerPage, displayList]);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <div className="container mt-4">
      <h1>All Venues</h1>
      <div className="d-flex justify-content-end mb-3">
        <select value={venuesPerPage} onChange={(e) => setVenuesPerPage(Number(e.target.value))} className="form-select">
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>
      <Pagination venuesPerPage={venuesPerPage} totalVenues={displayList.length} paginate={paginate} />
      <div className="row">
        {currentVenues.map(venue => (
          <Link key={venue.id} to={`/venues/${venue.id}`} className="col-md-4 mb-3">
            <div className="card venue-card h-100">
              <img src={venue.media[0]} className="card-img-top venue-image" alt={venue.name} />
              <div className="card-body">
                <h5 className="card-title venue-name">{venue.name}</h5>
                <p className="card-text venue-description">{truncateText(venue.description, 20)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Pagination venuesPerPage={venuesPerPage} totalVenues={displayList.length} paginate={paginate} />
    </div>
  );
}

export default Venues;
