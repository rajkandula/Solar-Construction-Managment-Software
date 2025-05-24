import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService'; // Import the auth service

// Define the shape of the user object
interface User {
  uid: string;
  username: string; // Corresponds to 'user' from backend session (which is usernameInput)
  utype: string; // User type (e.g., 'customer', 'admin', 'sales')
}

// Define the shape of the AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: authService.LoginCredentials) => Promise<void>;
  logout: () => Promise<void>; // Make logout async to handle backend logout
  register: (userData: authService.RegisterUserData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Start with loading true for initial check
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Effect to check for persisted user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }
    setLoading(false); // Initial loading finished
  }, []);

  // Login function
  const login = async (credentials: authService.LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.loginUser(credentials);
      const userData: User = { uid: response.uid, username: response.user, utype: response.utype };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData)); // Persist user
      navigate('/dashboard'); 
    } catch (err: any) {
      setError(err.error_msg || 'Login failed');
      setIsAuthenticated(false);
      throw err; // Re-throw to allow form to handle it
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: authService.RegisterUserData) => {
    setLoading(true);
    setError(null);
    try {
      // Assuming the backend /register route now returns the user or a success message
      // and might automatically log them in or require a separate login.
      // For now, after successful registration, we'll navigate to login.
      await authService.registerUser(userData);
      // If registration implies login, handle user state here as in login()
      navigate('/login?registrationSuccess=true'); // Redirect to login page after registration
    } catch (err: any) {
      setError(err.error_msg || 'Registration failed');
      throw err; // Re-throw to allow form to handle it
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logoutUserBackend(); // Call backend logout
    } catch (err) {
      console.error("Backend logout failed, proceeding with client-side logout", err);
      // Don't let backend logout failure stop client-side logout
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user'); // Clear persisted user
      setLoading(false);
      navigate('/login');
    }
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
