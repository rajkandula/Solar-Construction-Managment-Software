import React, { useState, FormEvent, useEffect } from 'react';
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeCardElementOptions } from '@stripe/stripe-js';
import * as orderService from '../services/orderService'; // Import the order service
import { useAuth } from '../contexts/AuthContext'; // For user context if needed

// Fetch your Stripe publishable key from config/settings.json or environment variables
// For now, using a placeholder. Replace this with your actual publishable key.
// In a real app, this should be loaded securely, e.g., via an API endpoint or environment variable.
const STRIPE_PUBLISHABLE_KEY = "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY"; // Replace with your actual key
if (STRIPE_PUBLISHABLE_KEY === "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY" || STRIPE_PUBLISHABLE_KEY === "YOUR_STRIPE_PUBLISHABLE_KEY") {
    console.warn("Using placeholder Stripe Publishable Key. Please replace with your actual key.");
}
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CreateOrderForm: React.FC = () => {
  const { user } = useAuth(); // Get user for potential order association or billing details
  const stripe = useStripe();
  const elements = useElements();

  const [orderDetails, setOrderDetails] = useState<orderService.OrderPayload>({
    panelType: '',
    powerOutput: '',
    quantity: 1,
    price: 0, // This should be the total price
    deliveryTimeline: '',
    description: '',
  });

  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  
  const [orderError, setOrderError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Ensure quantity and price are numbers
    const numValue = (name === 'quantity' || name === 'price') ? parseFloat(value) || 0 : value;
    setOrderDetails(prev => ({ ...prev, [name]: numValue }));
  };

  const handleOrderSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingOrder(true);
    setOrderError(null);
    setPaymentSuccess(false);
    setPaymentError(null);
    setShowPaymentForm(false); // Reset payment form visibility

    if (orderDetails.quantity <= 0 || orderDetails.price <= 0) {
        setOrderError("Quantity and Price must be positive values.");
        setLoadingOrder(false);
        return;
    }
    if (!user) {
        setOrderError("You must be logged in to create an order.");
        setLoadingOrder(false);
        return;
    }

    try {
      // 1. Create order via backend
      const createdOrderResponse = await orderService.createOrder(orderDetails);
      if (!createdOrderResponse.success || !createdOrderResponse.order || !createdOrderResponse.order._id) {
        throw new Error(createdOrderResponse.message || "Failed to create order: No order ID returned.");
      }
      const newOrderId = createdOrderResponse.order._id;
      setCreatedOrderId(newOrderId); 
      console.log('Order created:', createdOrderResponse.order);

      // 2. Create Payment Intent
      const paymentIntentResponse = await orderService.createPaymentIntent(newOrderId);
       if (paymentIntentResponse.error || !paymentIntentResponse.clientSecret) {
        throw new Error(paymentIntentResponse.error || "Failed to create payment intent: No client secret returned.");
      }
      setClientSecret(paymentIntentResponse.clientSecret);
      console.log('Payment Intent created, clientSecret:', paymentIntentResponse.clientSecret);
      
      setShowPaymentForm(true); // Show payment form part
    } catch (err: any) {
      setOrderError(err.message || 'Failed to create order or payment intent.');
    } finally {
      setLoadingOrder(false);
    }
  };

  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      setPaymentError("Stripe is not loaded yet or no client secret available.");
      return;
    }

    setLoadingPayment(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
        setPaymentError("Card details element not found.");
        setLoadingPayment(false);
        return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name: user?.username || 'Customer Name' }, // Optional: pass user's name
      },
    });

    if (stripeError) {
      setPaymentError(stripeError.message || "Payment failed due to an unknown Stripe error.");
    } else if (paymentIntent?.status === 'succeeded') {
      setPaymentSuccess(true);
      // Optionally: update order status on backend, navigate to a success page, etc.
      console.log('Payment Succeeded:', paymentIntent);
      // Example: navigate('/order-success/' + createdOrderId);
    } else {
      setPaymentError(`Payment status: ${paymentIntent?.status || 'unknown'}. Please try again or contact support.`);
    }
    setLoadingPayment(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create New Solar Panel Order</h1>
      
      {!showPaymentForm && (
        <form onSubmit={handleOrderSubmit} className="space-y-6">
          <div>
            <label htmlFor="panelType" className="block text-sm font-medium text-gray-700">Panel Type</label>
            <input type="text" name="panelType" id="panelType" value={orderDetails.panelType} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="powerOutput" className="block text-sm font-medium text-gray-700">Power Output (e.g., 300W)</label>
            <input type="text" name="powerOutput" id="powerOutput" value={orderDetails.powerOutput} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input type="number" name="quantity" id="quantity" value={orderDetails.quantity} onChange={handleInputChange} required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Total Price ($)</label>
            <input type="number" name="price" id="price" value={orderDetails.price} onChange={handleInputChange} required min="0.01" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="deliveryTimeline" className="block text-sm font-medium text-gray-700">Delivery Timeline (e.g., 2-4 weeks)</label>
            <input type="text" name="deliveryTimeline" id="deliveryTimeline" value={orderDetails.deliveryTimeline} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" value={orderDetails.description} onChange={handleInputChange} rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
          
          {orderError && <p className="text-red-600 text-sm p-3 bg-red-100 rounded-md">{orderError}</p>}
          
          <button type="submit" disabled={loadingOrder} className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition duration-150 ease-in-out">
            {loadingOrder ? 'Submitting Order...' : 'Submit Order & Proceed to Payment'}
          </button>
        </form>
      )}

      {showPaymentForm && clientSecret && createdOrderId && (
        <div className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Complete Your Payment</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow">
            <p className="text-md text-gray-700"><span className="font-semibold">Order ID:</span> {createdOrderId}</p>
            <p className="text-md text-gray-700"><span className="font-semibold">Panel Type:</span> {orderDetails.panelType}</p>
            <p className="text-md text-gray-700"><span className="font-semibold">Total Amount:</span> ${orderDetails.price.toFixed(2)}</p>
          </div>
          
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Details</label>
              <CardElement options={CARD_ELEMENT_OPTIONS} className="p-3 border border-gray-300 rounded-md shadow-sm bg-white"/>
            </div>

            {paymentError && <p className="text-red-600 text-sm p-3 bg-red-100 rounded-md">{paymentError}</p>}
            {paymentSuccess && (
              <div className="p-4 bg-green-100 text-green-700 border border-green-300 rounded-md shadow-sm">
                <h3 className="font-semibold text-lg">Payment Successful!</h3>
                <p>Your order (ID: {createdOrderId}) is confirmed. Thank you!</p>
                {/* Add link to order history or dashboard */}
              </div>
            )}
            
            {!paymentSuccess && (
              <button type="submit" disabled={!stripe || loadingPayment} className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 transition duration-150 ease-in-out">
                {loadingPayment ? 'Processing Payment...' : `Pay $${orderDetails.price.toFixed(2)}`}
              </button>
            )}
          </form>
           {!paymentSuccess && (
            <button 
                onClick={() => { setShowPaymentForm(false); setClientSecret(null); setCreatedOrderId(null); setOrderError(null);}} 
                className="mt-4 w-full text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
                disabled={loadingPayment}
            >
                Edit Order Details
            </button>
           )}
        </div>
      )}
    </div>
  );
};

const CreateOrderPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CreateOrderForm />
    </Elements>
  );
};

export default CreateOrderPage;
