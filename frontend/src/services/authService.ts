import axios from 'axios';

// Define the base URL for your API. This might come from an environment variable.
// For now, assuming the backend is running on the same host/port or proxied.
const API_BASE_URL = '/'; // Adjust if your API is hosted elsewhere, e.g., http://localhost:3000

// Define interfaces for the expected data structures
interface LoginCredentials {
  usernameInput: string;
  passwordInput: string;
}

interface UserData {
  usernameInput: string;
  passwordInput: string;
  unameInput: string;
  umailInput: string;
  umobileInput: string;
  // utype is defaulted to 'customer' by the backend for this route
}

interface AuthResponse {
  user: string; // username
  uid: string;
  utype: string;
  message?: string; // Optional success message
  error_msg?: string; // Optional error message
}

// Login User
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}login`, credentials);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Backend error with a message
      throw error.response.data;
    }
    // Network or other errors
    throw new Error('An unexpected error occurred during login.');
  }
};

// Register User (Customer)
export const registerUser = async (userData: UserData): Promise<AuthResponse> => {
  try {
    // The backend /register route defaults utype to 'customer'
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}register`, userData);
    return response.data; 
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred during registration.');
  }
};

// Placeholder for Admin Registration if needed later
// interface AdminData extends UserData {
//   operations_select: string; // utype for admin
// }
// export const registerAdmin = async (adminData: AdminData) => {
//   const response = await axios.post(`${API_BASE_URL}admin_register`, adminData);
//   return response.data;
// };

// You might also want a function to check current session status, or a logout API call if needed.
// For now, logout is handled client-side by clearing context/localStorage.
// If the backend has a /logout endpoint that invalidates the session, call it here.
export const logoutUserBackend = async (): Promise<void> => {
  try {
    await axios.get(`${API_BASE_URL}logout`); // Assuming /logout is a GET request
  } catch (error) {
    console.error("Error during backend logout:", error);
    // Even if backend logout fails, proceed with client-side logout
  }
};
