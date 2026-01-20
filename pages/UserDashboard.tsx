import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/mockApi';
import { Registration, User } from '../types';
import { PlusCircle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegs = async () => {
      const data = await dataService.getUserRegistrations(user.id);
      setRegistrations(data);
      setLoading(false);
    };
    fetchRegs();
  }, [user.id]);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> Success</span>;
      case 'FAILED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1"/> Failed</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1"/> Pending</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Impact Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your campaign registrations and contributions.</p>
        </div>
        <Link 
          to="/register" 
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700"
        >
          <PlusCircle className="mr-2 -ml-1 h-5 w-5" />
          Register for New Campaign
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by registering for a campaign today.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {registrations.map((reg) => (
              <li key={reg.id} className="hover:bg-gray-50 transition">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-brand-600 truncate">{reg.campaignName}</p>
                      <p className="text-xs text-gray-500">{new Date(reg.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                      {getStatusBadge(reg.donation?.status)}
                      {reg.donation?.status === 'SUCCESS' && (
                        <p className="mt-1 text-sm text-gray-900 font-semibold">${reg.donation.amount}</p>
                      )}
                       {reg.donation?.status === 'PENDING' && (
                         <Link to={`/donate/${reg.id}`} className="mt-1 text-xs text-brand-600 hover:underline">Complete Donation</Link>
                       )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Registered as: {reg.fullName} ({reg.phone})
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
