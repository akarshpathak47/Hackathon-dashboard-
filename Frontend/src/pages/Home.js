
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, isOrganizer } = useAuth();

  return (
    <div>
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-20 px-5 text-center">
        <div className="max-w-7xl mx-auto px-5">
          <h1 className="text-4xl md:text-5xl mb-5 font-bold">Welcome to EventHub</h1>
          <p className="text-xl mb-8">Discover and manage amazing events</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/events" 
              className="px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="px-5 py-2.5 bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700 transition-colors"
              >
                Get Started
              </Link>
            )}
            {isAuthenticated && isOrganizer && (
              <Link 
                to="/organizer/dashboard" 
                className="px-5 py-2.5 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 transition-colors"
              >
                Organizer Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="py-16 px-5">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-center mb-10 text-4xl text-gray-800 font-bold">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-lg p-5 mb-5 shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Event Discovery</h3>
              <p className="text-gray-600">Browse through a wide variety of events and find what interests you.</p>
            </div>
            <div className="bg-white rounded-lg p-5 mb-5 shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Easy Registration</h3>
              <p className="text-gray-600">Register for events with just a few clicks and manage your registrations.</p>
            </div>
            <div className="bg-white rounded-lg p-5 mb-5 shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Real-Time Updates</h3>
              <p className="text-gray-600">Get live updates on event registrations and availability.</p>
            </div>
            <div className="bg-white rounded-lg p-5 mb-5 shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Event Management</h3>
              <p className="text-gray-600">Organizers can create and manage their events effortlessly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;