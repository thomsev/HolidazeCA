export const isDateAvailable = (date, availableDates) => {
    if (!(date instanceof Date) || !Array.isArray(availableDates)) {
      throw new Error('Invalid arguments passed to isDateAvailable function');
    }
    
    try {
      const dateString = date.toISOString().split('T')[0];
      return availableDates.includes(dateString);
    } catch (error) {
      console.error('Error checking date availability:', error);
      return false;
    }
  };
  