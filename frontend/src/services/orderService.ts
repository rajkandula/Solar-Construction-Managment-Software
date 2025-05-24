import axios from 'axios';

const API_BASE_URL = '/'; // Adjust if your API is hosted elsewhere

// Interface for order details payload for creating an order
export interface OrderPayload {
  panelType: string;
  powerOutput: string;
  quantity: number;
  price: number; // Total price
  deliveryTimeline: string;
  description: string;
}

// Interface for the expected response when an order is created
interface OrderResponseData {
  _id: string;
  userId: string;
  panelType: string;
  powerOutput: string;
  quantity: number;
  price: number;
  deliveryTimeline: string;
  description: string;
  date_posted: string;
  status: string;
  paymentIntentId?: string;
  paymentStatus?: string;
  amountPaid?: number;
  currency?: string;
  // other fields as returned by the backend
}

interface CreateOrderApiResponse {
  success: boolean;
  order: OrderResponseData;
  message?: string; // Optional error message
}

// Interface for the expected response when creating a payment intent
interface PaymentIntentResponse {
  clientSecret: string;
  error?: string; // Optional error message
}

// Function to create a new order
export const createOrder = async (orderDetails: OrderPayload): Promise<CreateOrderApiResponse> => {
  try {
    // The backend route is /submitOrder, method POST
    const response = await axios.post<CreateOrderApiResponse>(`${API_BASE_URL}submitOrder`, orderDetails);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Backend error with a message
      throw error.response.data;
    }
    // Network or other errors
    throw new Error('An unexpected error occurred while creating the order.');
  }
};

// Function to create a payment intent for an existing order
export const createPaymentIntent = async (orderId: string): Promise<PaymentIntentResponse> => {
  try {
    // The backend route is /api/orders/:orderId/create-payment-intent, method POST
    const response = await axios.post<PaymentIntentResponse>(`${API_BASE_URL}api/orders/${orderId}/create-payment-intent`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Backend error with a message
      throw error.response.data;
    }
    // Network or other errors
    throw new Error('An unexpected error occurred while creating the payment intent.');
  }
};

// Interface for individual order items (adjust based on actual backend response)
export interface Order {
  _id: string;
  userId: string;
  panelType: string;
  powerOutput: string;
  quantity: number;
  price: number;
  deliveryTimeline: string;
  description: string;
  date_posted: string;
  status: string;
  paymentIntentId?: string;
  paymentStatus?: string;
  amountPaid?: number;
  currency?: string;
  message?: string; // For status updates
  history?: Array<{
    status: string;
    comment: string;
    approved_by: string;
    date_posted: string;
  }>;
  // Add any other fields your backend returns for an order
}

// Function to get the current user's order history
export const getOrderHistory = async (): Promise<Order[]> => {
  try {
    // The backend route is /orderHistory, method GET
    // This route relies on the session to get the user ID.
    const response = await axios.get<Order[]>(`${API_BASE_URL}orderHistory`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Backend error with a message
      throw error.response.data;
    }
    // Network or other errors
    throw new Error('An unexpected error occurred while fetching order history.');
  }
};

// Function to get all orders (for staff)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    // The backend route is /getOrders, method GET
    const response = await axios.get<Order[]>(`${API_BASE_URL}getOrders`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching all orders.');
  }
};

// Function to get specific order details (for staff view)
export const getOrderDetails = async (orderId: string): Promise<Order> => {
  try {
    // The backend route is /panels/:orderId, method GET
    const response = await axios.get<Order>(`${API_BASE_URL}panels/${orderId}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching order details.');
  }
};
