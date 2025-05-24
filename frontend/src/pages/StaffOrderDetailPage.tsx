import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as orderService from '../services/orderService'; // Import the order service
import { useAuth } from '../contexts/AuthContext'; // For role-based access

const StaffOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth(); 
  const [order, setOrder] = useState<orderService.Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user || !['sales', 'manager', 'construction', 'admin'].includes(user.utype)) {
        setError("You are not authorized to view this page.");
        setLoading(false);
        return;
      }
      if (!orderId) {
        setError("Order ID is missing from the URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const fetchedOrder = await orderService.getOrderDetails(orderId);
        setOrder(fetchedOrder);
        setError(null);
      } catch (err: any) {
        console.error(`Error fetching details for order ${orderId}:`, err);
        setError(err.message || `Failed to fetch details for order ${orderId}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, user]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg text-gray-700">Loading order details...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-6 max-w-lg mx-auto text-center bg-red-50 text-red-700 border border-red-300 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Error</h2>
            <p>{error}</p>
            <Link to="/staff/orders" className="mt-4 inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150">
                Back to All Orders
            </Link>
        </div>
    );
  }

  if (!order) {
    return (
        <div className="p-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-700">Order Not Found</h1>
            <p className="text-gray-500 mt-2">The order with ID <span className="font-mono">{orderId}</span> could not be found.</p>
            <Link to="/staff/orders" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 transition duration-150">
                &larr; Back to All Orders
            </Link>
        </div>
    );
  }
  
  const DetailItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
    <div>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</h3>
      <p className="mt-1 text-md text-gray-800">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Order Details</h1>
        <Link to="/staff/orders" className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-150 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to All Orders
        </Link>
      </div>

      <div className="bg-white shadow-xl rounded-lg">
        {/* Main Order Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailItem label="Order ID" value={order._id} />
            <DetailItem label="User ID" value={order.userId} />
            <DetailItem label="Date Posted" value={new Date(order.date_posted).toLocaleString()} />
            <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</h3>
                <p className={`mt-1 text-md font-semibold ${
                    order.status === 'Completed' ? 'text-green-600' :
                    order.status === 'InProgress' ? 'text-yellow-600' :
                    order.status === 'Rejected' ? 'text-red-600' :
                    order.status === 'Approved' ? 'text-cyan-600' :
                    order.status === 'Payment Complete' ? 'text-teal-600' :
                    'text-blue-600'
                }`}>{order.status}</p>
            </div>
            <div className="md:col-span-3">
                <DetailItem label="Description" value={order.description} />
            </div>
             {order.message && <div className="md:col-span-3"><DetailItem label="Last Message/Update" value={order.message} /></div>}
          </div>
        </div>

        {/* Product and Delivery Details */}
        <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Product & Delivery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailItem label="Panel Type" value={order.panelType} />
                <DetailItem label="Power Output" value={order.powerOutput} />
                <DetailItem label="Quantity" value={order.quantity} />
                <DetailItem label="Delivery Timeline" value={order.deliveryTimeline} />
            </div>
        </div>
        
        {/* Payment Details */}
        <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailItem label="Total Price" value={`$${order.price.toFixed(2)} ${order.currency || ''}`.trim()} />
                 <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Payment Status</h3>
                    <p className={`mt-1 text-md font-semibold ${
                        order.paymentStatus === 'succeeded' ? 'text-green-600' :
                        order.paymentStatus === 'pending' ? 'text-yellow-600' :
                        order.paymentStatus === 'failed' ? 'text-red-600' :
                        'text-gray-600' // Default for N/A or other
                    }`}>{order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'N/A'}</p>
                </div>
                <DetailItem label="Amount Paid" value={order.amountPaid !== undefined ? `$${order.amountPaid.toFixed(2)}` : 'N/A'} />
                <DetailItem label="Payment Intent ID" value={order.paymentIntentId} />
            </div>
        </div>
        
        {/* Order History Trail */}
        {order.history && order.history.length > 0 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Order History Trail</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {order.history.slice().reverse().map((entry, index) => ( // Show newest first
                <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-150">
                  <p className="text-sm font-semibold text-gray-700">
                    Status: <span className="font-bold">{entry.status}</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">Comment: {entry.comment || <span className="italic text-gray-400">No comment provided.</span>}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    By: {entry.approved_by} &bull; {new Date(entry.date_posted).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder for Status Update Form */}
        <div className="p-6 border-t border-gray-200 mt-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Update Order Status</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                <p className="text-yellow-700">
                    <span className="font-bold">Note:</span> Status update functionality will be implemented in a future task.
                </p>
            </div>
            {/* Example: <UpdateOrderStatusForm orderId={order._id} currentStatus={order.status} userRoles={user?.utype ? [user.utype] : []} /> */}
        </div>
      </div>
    </div>
  );
};

export default StaffOrderDetailPage;
