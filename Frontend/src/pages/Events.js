
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadEvents();
  }, [searchTerm, category]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (category) params.category = category;

      const response = await eventsAPI.getAll(params);
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading events...</div>;
  }

  return (
    <div className="py-10 px-5">
      <div className="max-w-7xl mx-auto px-5">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">All Events</h1>
        <div className="flex gap-4 mb-8 flex-wrap">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-w-[150px] px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {events.length === 0 ? (
          <div className="text-center py-16 px-5 text-gray-600 text-lg">No events found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg p-5 mb-5 shadow-md relative transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${event.isFull ? 'bg-red-600' : 'bg-green-600'}`}>
                  {event.isFull ? 'Full' : 'Available'}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{event.title}</h3>
                <p className="text-gray-600 my-4 line-clamp-3">{event.description}</p>
                <div className="my-5">
                  <p className="my-2 text-sm">
                    <strong>Date:</strong> {formatDate(event.date)}
                  </p>
                  <p className="my-2 text-sm">
                    <strong>Time:</strong> {event.time}
                  </p>
                  <p className="my-2 text-sm">
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p className="my-2 text-sm">
                    <strong>Category:</strong> {event.category}
                  </p>
                  <p className="my-2 text-sm">
                    <strong>Registrations:</strong> {event.registrationCount} / {event.maxRegistrations}
                  </p>
                </div>
                <Link 
                  to={`/events/${event._id}`} 
                  className="block w-full text-center px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;