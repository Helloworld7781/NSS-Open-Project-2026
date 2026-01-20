import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/mockApi';
import { User } from '../types';
import { FileText, ChevronRight } from 'lucide-react';

interface RegistrationProps {
  user: User;
}

const Registration: React.FC<RegistrationProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    fullName: user.name || '',
    phone: '',
    campaignName: 'Education for All', // Default selection
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Step 1: Create Registration (Persists regardless of donation later)
    const reg = await dataService.createRegistration(user.id, formData);
    
    // Step 2: Navigate to Donation Screen with the new Registration ID
    navigate(`/donate/${reg.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg sm:rounded-xl overflow-hidden border border-slate-200">
        <div className="px-6 py-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center">
             <div className="bg-brand-100 p-3 rounded-full mr-4">
               <FileText className="h-6 w-6 text-brand-600" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-slate-900">Step 1: Campaign Registration</h3>
               <p className="mt-1 text-sm text-slate-500">Join the cause. Your commitment matters.</p>
             </div>
          </div>
        </div>
        
        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="campaign" className="block text-sm font-semibold text-slate-700 mb-2">Select Campaign</label>
              <select
                id="campaign"
                className="bg-white block w-full pl-3 pr-10 py-3 text-base border-slate-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-lg border text-slate-900 shadow-sm"
                value={formData.campaignName}
                onChange={(e) => setFormData({...formData, campaignName: e.target.value})}
              >
                <option>Education for All</option>
                <option>Clean Water Initiative</option>
                <option>Disaster Relief Fund</option>
                <option>Tree Plantation Drive</option>
              </select>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                required
                className="bg-white mt-1 focus:ring-brand-500 focus:border-brand-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-lg py-3 px-4 border text-slate-900 placeholder-slate-400"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                id="phone"
                required
                placeholder="+1 (555) 000-0000"
                className="bg-white mt-1 focus:ring-brand-500 focus:border-brand-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-lg py-3 px-4 border text-slate-900 placeholder-slate-400"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-all hover:shadow-lg"
              >
                {submitting ? 'Registering...' : (
                  <span className="flex items-center">
                    Proceed to Donation <ChevronRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
              <p className="mt-4 text-xs text-center text-slate-500">
                Your registration data is saved securely immediately upon clicking "Proceed".
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;