import React, { useEffect, useState } from 'react';
import * as orderService from '../services/orderService'; // Import the order service
import { Link } from 'react-router-dom'; // For potential links to order details
import { useAuth } from '../contexts/AuthContext'; // To ensure user is authenticated

const OrderHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<orderService.Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user) {
        setError("User not authenticated. Please log in to view your order history.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const fetchedOrders = await orderService.getOrderHistory();
        setOrders(fetchedOrders);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching order history:", err);
        setError(err.message || 'Failed to fetch order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading order history...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="p-6 max-w-lg mx-auto text-center bg-red-50 text-red-700 border border-red-300 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Error</h2>
            <p>{error}</p>
            <Link to="/dashboard" className="mt-4 inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150">
             Go to Dashboard
            </Link>
        </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Order History</h1>
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <p className="text-gray-600 text-lg mt-4">You have no orders yet.</p>
        <p className="text-gray-500 text-sm mt-2">Looks like you haven't placed any orders with us. Start by creating one!</p>
        <Link to="/create-order" className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105">
          Create Your First Order
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">My Order History</h1>
      <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date Posted</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Panel Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Payment Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Delivery Timeline</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-800" title={order._id}>
                  {/* Link to a detailed order view if available in the future */}
                  {/* <Link to={`/orders/${order._id}`}>{order._id.substring(0, 8)}...</Link> */}
                  {order._id.substring(order._id.length - 8)} {/* Show last 8 chars */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(order.date_posted).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.panelType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{order.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${order.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-800 border border-green-300' :
                    order.status === 'InProgress' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                    order.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-300' :
                    order.status === 'Payment Complete' ? 'bg-teal-100 text-teal-800 border border-teal-300' :
                    'bg-blue-100 text-blue-800 border border-blue-300' // Default for 'Order Created' or others
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                   <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                    order.paymentStatus === 'succeeded' ? 'bg-green-100 text-green-800 border border-green-300' :
                    order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800 border border-red-300' :
                    'bg-gray-200 text-gray-800 border border-gray-300'
                  }`}>
                    {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.deliveryTimeline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
