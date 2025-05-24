import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState<string>(new Date().toLocaleString());

  useEffect(() => {
    // Update the date and time every second
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, []);

  if (!user) {
    // This should ideally not happen if ProtectedRoute is working correctly,
    // but as a fallback:
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">User not found. Please log in again.</p>
        <Link to="/login" className="text-blue-500 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome, {user.username}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            We are glad to have you here.
          </p>
        </div>

        <div className="mb-10 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-md">
          <p className="text-lg font-semibold text-blue-700">Current Date and Time:</p>
          <p className="text-md text-blue-600">{currentDateTime}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/create-order" // Placeholder route
            className="block p-6 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 text-center"
          >
            <h2 className="text-2xl font-semibold">Create New Order</h2>
            <p className="mt-2">Place an order for solar panels.</p>
          </Link>

          <Link
            to="/order-history" // Placeholder route
            className="block p-6 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 text-center"
          >
            <h2 className="text-2xl font-semibold">View Order History</h2>
            <p className="mt-2">Check the status of your past orders.</p>
          </Link>
        </div>

        {/* Optional: Profile Information Section - can be expanded later */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">My Profile</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-md text-gray-600">
              <span className="font-semibold">Username:</span> {user.username}
            </p>
            <p className="text-md text-gray-600">
              <span className="font-semibold">User ID:</span> {user.uid}
            </p>
            <p className="text-md text-gray-600">
              <span className="font-semibold">Account Type:</span> {user.utype}
            </p>
            {/* Add more profile details here if available and needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
