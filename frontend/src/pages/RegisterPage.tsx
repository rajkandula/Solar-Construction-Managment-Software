import React, { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterUserData } from '../services/authService'; // Import the type

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterUserData>({
    usernameInput: '',
    passwordInput: '',
    unameInput: '', // Corresponds to name
    umailInput: '', // Corresponds to email
    umobileInput: '', // Corresponds to mobile
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, loading, error: authError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (
      !formData.usernameInput ||
      !formData.passwordInput ||
      !formData.unameInput ||
      !formData.umailInput ||
      !formData.umobileInput
    ) {
      setFormError('All fields are required.');
      return;
    }

    if (formData.passwordInput !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(formData.umailInput)) {
        setFormError('Please enter a valid email address.');
        return;
    }

    // Basic mobile validation (e.g., 10 digits)
    if (!/^\d{10}$/.test(formData.umobileInput)) {
        setFormError('Mobile number must be 10 digits.');
        return;
    }


    try {
      await register(formData);
      // Navigation to login with a success message is handled by AuthContext
    } catch (err: any) {
      setFormError(err.error_msg || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Account</h1>
      {authError && !formError && (
         <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {authError}
        </div>
      )}
      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {formError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="unameInput"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="unameInput"
            name="unameInput"
            value={formData.unameInput}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label
            htmlFor="usernameInput_register"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="usernameInput_register"
            name="usernameInput"
            value={formData.usernameInput}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="yourusername"
            required
          />
        </div>
        <div>
          <label
            htmlFor="umailInput"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="umailInput"
            name="umailInput"
            value={formData.umailInput}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label
            htmlFor="umobileInput"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile Number
          </label>
          <input
            type="tel"
            id="umobileInput"
            name="umobileInput"
            value={formData.umobileInput}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="1234567890"
            required
          />
        </div>
        <div>
          <label
            htmlFor="passwordInput_register"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="passwordInput_register"
            name="passwordInput"
            value={formData.passwordInput}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
