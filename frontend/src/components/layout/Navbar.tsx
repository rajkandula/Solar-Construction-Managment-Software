import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    // Navigation is handled by AuthContext on successful logout
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-gray-300 transition duration-150">
          SolarApp
        </Link>
        <div className="flex items-center">
          {loading ? (
            <span className="text-sm">Loading...</span>
          ) : isAuthenticated && user ? (
            <>
              <span className="mr-4 text-sm">Welcome, {user.username}!</span>
              <Link
                to="/dashboard"
                className="mr-4 text-sm hover:text-gray-300 transition duration-150"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="mr-4 text-sm hover:text-gray-300 transition duration-150"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm hover:text-gray-300 transition duration-150"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
