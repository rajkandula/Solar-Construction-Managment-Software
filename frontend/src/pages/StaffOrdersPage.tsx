import React, { useEffect, useState } from 'react';
import * as orderService from '../services/orderService'; // Import the order service
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // For role-based access

const StaffOrdersPage: React.FC = () => {
  const { user } = useAuth(); 
  const [orders, setOrders] = useState<orderService.Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>(''); 

  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      if (!user || !['sales', 'manager', 'construction', 'admin'].includes(user.utype)) {
        setError("You are not authorized to view this page.");
        setLoading(false);
        return;
      }
      try {
        const fetchedOrders = await orderService.getAllOrders();
        setOrders(fetchedOrders);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching all orders:", err);
        setError(err.message || 'Failed to fetch all orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [user]);
  
  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  const uniqueStatuses = Array.from(new Set(orders.map(order => order.status))).sort();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg text-gray-700">Loading all orders...</p>
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

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">All Customer Orders</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg shadow">
        <span className="text-lg font-medium text-gray-700">Manage and view all orders in the system.</span>
        <div className="flex items-center">
            <label htmlFor="statusFilter" className="mr-2 text-sm font-medium text-gray-700">Filter by status:</label>
            <select 
                id="statusFilter"
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full sm:w-auto p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            >
            <option value="">All Statuses</option>
            {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
            ))}
            </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
         <div className="p-10 text-center bg-white rounded-lg shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-600 text-lg mt-4">
                {filterStatus ? `No orders found with status: "${filterStatus}".` : "No orders found in the system."}
            </p>
         </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">User ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date Posted</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Panel Type</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Payment Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    <Link to={`/staff/orders/${order._id}`} title={`View details for order ${order._id}`}>
                        {order._id.substring(order._id.length - 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" title={order.userId}>
                    {order.userId.substring(order.userId.length - 6)}
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
                      order.status === 'Approved' ? 'bg-cyan-100 text-cyan-800 border border-cyan-300' :
                      order.status === 'Payment Complete' ? 'bg-teal-100 text-teal-800 border border-teal-300' :
                      'bg-blue-100 text-blue-800 border border-blue-300'
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffOrdersPage;
