import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, registrationsAPI } from '../services/api';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvent();
    checkRegistration();

    // Join event room for real-time updates
    socket.emit('join-event', id);

    // Listen for registration updates
    socket.on('registration-update', (data) => {
      if (data.eventId === id) {
        setRegistrationCount(data.registrationCount);
        setEvent((prev) => ({
          ...prev,
          registrationCount: data.registrationCount,
          isFull: data.isFull,
        }));
      }
    });

    return () => {
      socket.emit('leave-event', id);
      socket.off('registration-update');
    };
  }, [id]);

  const loadEvent = async () => {
    try {
      const response = await eventsAPI.getOne(id);
      setEvent(response.data.data);
      setRegistrationCount(response.data.data.registrationCount);
    } catch (error) {
      console.error('Error loading event:', error);
      setError('Event not found');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await registrationsAPI.getMyRegistrations();
      const registered = response.data.data.some(
        (reg) => reg.event._id === id || reg.event === id
      );
      setIsRegistered(registered);
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await registrationsAPI.register(id);
      setIsRegistered(true);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleCancel = async () => {
    try {
      await registrationsAPI.cancel(id);
      setIsRegistered(false);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Cancellation failed');
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
    return <div className="flex justify-center items-center h-screen text-lg">Loading event...</div>;
  }

  if (error && !event) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="text-red-700 bg-red-100 border border-red-300 p-3 rounded mb-5">{error}</div>
        <Link to="/events" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors">
          Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return <div className="flex justify-center items-center h-screen text-lg">Event not found</div>;
  }

  return (
    <div className="py-10 px-5">
      <div className="max-w-7xl mx-auto px-5">
        <Link to="/events" className="inline-block mb-5 text-blue-600 no-underline hover:underline">
          ← Back to Events
        </Link>
        <div className="bg-white rounded-lg p-8 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <h1 className="m-0 text-gray-800 text-3xl font-bold">{event.title}</h1>
            <div className={`px-4 py-2 rounded-full text-sm font-bold text-white ${event.isFull ? 'bg-red-600' : 'bg-green-600'}`}>
              {event.isFull ? 'Full' : 'Available'}
            </div>
          </div>
          {error && (
            <div className="text-red-700 bg-red-100 border border-red-300 p-3 rounded mb-5">
              {error}
            </div>
          )}
          <div className="grid gap-8">
            <div className="p-5 bg-gray-50 rounded">
              <h3 className="mb-4 text-gray-800 text-xl font-semibold border-b-2 border-blue-600 pb-2">Event Details</h3>
              <p className="my-2 leading-relaxed">
                <strong>Date:</strong> {formatDate(event.date)}
              </p>
              <p className="my-2 leading-relaxed">
                <strong>Time:</strong> {event.time}
              </p>
              <p className="my-2 leading-relaxed">
                <strong>Location:</strong> {event.location}
              </p>
              <p className="my-2 leading-relaxed">
                <strong>Category:</strong> {event.category}
              </p>
              <p className="my-2 leading-relaxed">
                <strong>Organizer:</strong> {event.organizer?.name || 'N/A'}
              </p>
            </div>
            <div className="p-5 bg-gray-50 rounded">
              <h3 className="mb-4 text-gray-800 text-xl font-semibold border-b-2 border-blue-600 pb-2">Description</h3>
              <p className="leading-relaxed">{event.description}</p>
            </div>
            <div className="p-5 bg-gray-50 rounded">
              <h3 className="mb-4 text-gray-800 text-xl font-semibold border-b-2 border-blue-600 pb-2">Registration</h3>
              <p className="my-2 leading-relaxed">
                <strong>Registrations:</strong> {registrationCount} / {event.maxRegistrations}
              </p>
              {isAuthenticated ? (
                isRegistered ? (
                  <div>
                    <p className="text-green-700 bg-green-100 border border-green-300 p-3 rounded mb-3">
                      You are registered for this event
                    </p>
                    <button 
                      onClick={handleCancel} 
                      className="px-5 py-2.5 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 transition-colors"
                    >
                      Cancel Registration
                    </button>
                  </div>
                ) : (
                  <div>
                    {event.isFull ? (
                      <p className="text-red-700 bg-red-100 border border-red-300 p-3 rounded">
                        This event is full
                      </p>
                    ) : (
                      <button 
                        onClick={handleRegister} 
                        className="px-5 py-2.5 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 transition-colors"
                      >
                        Register for Event
                      </button>
                    )}
                  </div>
                )
              ) : (
                <p>
                  <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to register for this event
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;