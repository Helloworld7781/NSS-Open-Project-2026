import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/mockApi';
import { Heart, ChevronRight, Gift } from 'lucide-react';

const GuestDonation: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    campaignName: 'Education for All', // Default selection
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Step 1: Create Registration with 'guest' ID
    const reg = await dataService.createRegistration('guest', formData);
    
    // Step 2: Navigate to Donation Screen
    navigate(`/donate/${reg.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white shadow-xl sm:rounded-xl overflow-hidden border border-slate-200">
        <div className="bg-brand-50 border-b border-brand-100 px-4 py-8 text-center sm:px-10">
           <div className="mx-auto bg-white p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow-sm">
             <Gift className="h-10 w-10 text-brand-600" />
           </div>
           <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Make a Donation</h3>
           <p className="mt-3 text-slate-600 max-w-lg mx-auto text-lg leading-relaxed">
             You don't need an account to make a difference. Fill in your details below to proceed to the secure payment panel.
           </p>
        </div>
        
        <div className="px-6 py-8 sm:p-10 bg-white">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="campaign" className="block text-sm font-bold text-slate-700 mb-2">I want to support</label>
              <div className="relative">
                <select
                  id="campaign"
                  className="bg-white block w-full pl-4 pr-10 py-3 text-base border-slate-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-lg border text-slate-900 shadow-sm"
                  value={formData.campaignName}
                  onChange={(e) => setFormData({...formData, campaignName: e.target.value})}
                >
                  <option className="text-slate-900">Education for All</option>
                  <option className="text-slate-900">Clean Water Initiative</option>
                  <option className="text-slate-900">Disaster Relief Fund</option>
                  <option className="text-slate-900">Tree Plantation Drive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  required
                  placeholder="e.g. Jane Doe"
                  className="bg-white mt-1 focus:ring-brand-500 focus:border-brand-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-lg py-3 px-4 border text-slate-900 placeholder-slate-400"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
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
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-md text-base font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
              >
                {submitting ? 'Processing...' : (
                  <span className="flex items-center">
                    Proceed to Payment <ChevronRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </button>
              <p className="mt-4 text-sm text-center text-slate-500">
                Your information is securely recorded for administrative purposes.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestDonation;