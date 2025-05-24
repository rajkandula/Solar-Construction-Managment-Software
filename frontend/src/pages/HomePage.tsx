import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to SolarApp</h1>
      <p className="text-lg mb-8">
        Your one-stop solution for managing solar panel orders and projects.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </Link>
        <Link
          to="/dashboard"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Dashboard (Protected)
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
