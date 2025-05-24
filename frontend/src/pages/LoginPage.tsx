import React, { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const { login, loading, error: authError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const registrationSuccess = new URLSearchParams(location.search).get('registrationSuccess');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!usernameInput || !passwordInput) {
      setFormError('Both username and password are required.');
      return;
    }

    try {
      await login({ usernameInput, passwordInput });
      // Navigation is handled by AuthContext on successful login
    } catch (err: any) {
      // AuthContext's login function re-throws the error
      // err.error_msg is from the backend response structure
      setFormError(err.error_msg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>
      {registrationSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">
          Registration successful! Please log in.
        </div>
      )}
      {authError && !formError && ( // Display context error if no specific form error
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {authError}
        </div>
      )}
      {formError && ( // Display form-specific error
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {formError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="username_login"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username_login"
            name="usernameInput"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="yourusername"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password_login"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password_login"
            name="passwordInput"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
