import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import OrganizerDashboard from './pages/OrganizerDashboard';
import UserDashboard from './pages/UserDashboard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';

const PrivateRoute = ({ children, requireOrganizer = false }) => {
  const { isAuthenticated, isOrganizer, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireOrganizer && !isOrganizer) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppRoutes() {
  const { isAuthenticated, isOrganizer } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={isOrganizer ? '/organizer/dashboard' : '/dashboard'} /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to={isOrganizer ? '/organizer/dashboard' : '/dashboard'} /> : <Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/organizer/dashboard"
          element={
            <PrivateRoute requireOrganizer>
              <OrganizerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/organizer/events/create"
          element={
            <PrivateRoute requireOrganizer>
              <CreateEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/organizer/events/edit/:id"
          element={
            <PrivateRoute requireOrganizer>
              <EditEvent />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;