import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();

    // Listen for registration updates
    socket.on('registration-update', (data) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === data.eventId
            ? {
                ...event,
                registrationCount: data.registrationCount,
                isFull: data.isFull,
              }
            : event
        )
      );
    });

    return () => {
      socket.off('registration-update');
    };
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventsAPI.getMyEvents();
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(eventId);
        setEvents(events.filter((event) => event._id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
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
          <h1 className="text-gray-800 m-0 text-3xl font-bold">Organizer Dashboard</h1>
          <Link 
            to="/organizer/events/create" 
            className="px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Create New Event
          </Link>
        </div>
        <h2 className="mb-5 text-2xl font-semibold text-gray-800">My Events</h2>
        {events.length === 0 ? (
          <div className="text-center py-16 px-5 bg-white rounded-lg shadow-md">
            <p className="mb-5 text-gray-600 text-lg">You haven't created any events yet.</p>
            <Link 
              to="/organizer/events/create" 
              className="px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg p-5 mb-5 shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
                  <h3 className="m-0 flex-1 text-xl font-semibold text-gray-800">{event.title}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${event.isFull ? 'bg-red-600' : 'bg-green-600'}`}>
                    {event.isFull ? 'Full' : 'Available'}
                  </div>
                </div>
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
                    <strong>Registrations:</strong>{' '}
                    <span className="font-bold text-blue-600">
                      {event.registrationCount} / {event.maxRegistrations}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-2.5 mt-5">
                  <Link
                    to={`/organizer/events/edit/${event._id}`}
                    className="flex-1 min-w-[100px] text-center px-5 py-2.5 bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/events/${event._id}`}
                    className="flex-1 min-w-[100px] text-center px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="flex-1 min-w-[100px] px-5 py-2.5 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;