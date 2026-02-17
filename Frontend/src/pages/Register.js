import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      // Wait a moment for context to update, then navigate
      setTimeout(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.role === 'organizer') {
            navigate('/organizer/dashboard');
          } else {
            navigate('/dashboard');
          }
        } else {
          navigate('/dashboard');
        }
      }, 100);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-5">
      <div className="bg-white rounded-lg p-10 w-full max-w-md shadow-lg">
        <h2 className="mb-8 text-center text-gray-800 text-2xl font-semibold">Register</h2>
        {error && (
          <div className="text-red-700 bg-red-100 border border-red-300 p-3 rounded mb-5">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-gray-700">Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 no-underline hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;