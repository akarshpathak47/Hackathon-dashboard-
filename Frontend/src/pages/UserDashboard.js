import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationsAPI } from '../services/api';

const UserDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const response = await registrationsAPI.getMyRegistrations();
      setRegistrations(response.data.data);
    } catch (error) {
      console.error('Error loading registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId) => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      try {
        await registrationsAPI.cancel(eventId);
        setRegistrations(
          registrations.filter(
            (reg) => (reg.event._id || reg.event) !== eventId
          )
        );
      } catch (error) {
        console.error('Error cancelling registration:', error);
        alert('Failed to cancel registration');
      }
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
    return <div className="flex justify-center items-center h-screen text-lg">Loading dashboard...</div>;
  }

  return (
    <div className="py-10 px-5">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-gray-800 m-0 text-3xl font-bold">My Events</h1>
          <Link 
            to="/events" 
            className="px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </Link>
        </div>
        {registrations.length === 0 ? (
          <div className="text-center py-16 px-5 bg-white rounded-lg shadow-md">
            <p className="mb-5 text-gray-600 text-lg">You haven't registered for any events yet.</p>
            <Link 
              to="/events" 
              className="px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {registrations.map((registration) => {
              const event = registration.event;
              const eventId = event._id || event;
              return (
                <div key={registration._id} className="bg-white rounded-lg p-5 mb-5 shadow-md">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{event.title || 'Event'}</h3>
                  <p className="text-gray-600 my-4 line-clamp-3">
                    {event.description || 'No description available'}
                  </p>
                  <div className="my-5">
                    <p className="my-2 text-sm">
                      <strong>Date:</strong>{' '}
                      {event.date ? formatDate(event.date) : 'TBA'}
                    </p>
                    <p className="my-2 text-sm">
                      <strong>Time:</strong> {event.time || 'TBA'}
                    </p>
                    <p className="my-2 text-sm">
                      <strong>Location:</strong> {event.location || 'TBA'}
                    </p>
                    <p className="my-2 text-sm">
                      <strong>Registered:</strong>{' '}
                      {formatDate(registration.registeredAt)}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2.5 mt-5">
                    <Link
                      to={`/events/${eventId}`}
                      className="flex-1 min-w-[100px] text-center px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleCancel(eventId)}
                      className="flex-1 min-w-[100px] px-5 py-2.5 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 transition-colors"
                    >
                      Cancel Registration
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;