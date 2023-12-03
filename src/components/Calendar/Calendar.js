import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function VenueCalendar({ onChange, bookedDates = [], selectedDates, highlightedDates = [] }) {
    // check if a date is booked
    const isDateBooked = (date) => {
        return bookedDates.some(bookedDate => 
            date >= new Date(bookedDate.dateFrom) && date <= new Date(bookedDate.dateTo)
        );
    };

    // check if a date is within the highlighted range
    const isDateHighlighted = (date) => {
        const formattedDate = date.toISOString().split('T')[0]; 
        return highlightedDates.includes(formattedDate);
    };

    return (
        <Calendar
            onChange={onChange}
            value={selectedDates} 
            tileClassName={({ date, view }) => {
                if (view === 'month') {
                    if (isDateBooked(date)) {
                        return 'bookedDate'; 
                    }
                    if (isDateHighlighted(date)) {
                        return 'highlightedDate'; 
                    }
                }
                return null; 
            }}
            selectRange={true} // Enable range selection
        />
    );
}

export default VenueCalendar;
