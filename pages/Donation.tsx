import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataService, authService } from '../services/mockApi';
import { Registration } from '../types';
import { CreditCard, Heart, Lock, ShieldCheck, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const Donation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [amount, setAmount] = useState<number>(50);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useState(authService.getCurrentUser());

  // Payment Form State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  // Simulation State
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [processingStep, setProcessingStep] = useState('');

  useEffect(() => {
    if (id) {
      dataService.getRegistrationById(id).then(reg => {
        if (reg) {
          setRegistration(reg);
          if (reg.donation?.amount && reg.donation.amount > 0) {
              setAmount(reg.donation.amount);
          }
        }
        setLoading(false);
      });
    }
  }, [id]);

  const simulateProcessing = async () => {
    setPaymentStatus('PROCESSING');
    
    const steps = [
      'Encrypting data...',
      'Contacting bank...',
      'Verifying credentials...',
      'Authorizing transaction...'
    ];

    for (const step of steps) {
      setProcessingStep(step);
      await new Promise(r => setTimeout(r, 800)); // 800ms per step
    }

    // Default to success for the form submit to satisfy "see payment being done".
    await finalizePayment('SUCCESS');
  };

  const finalizePayment = async (status: 'SUCCESS' | 'FAILED') => {
    if (!id) return;
    
    if (status === 'SUCCESS') {
        setProcessingStep('Payment Approved!');
        await new Promise(r => setTimeout(r, 500));
        await dataService.processDonation(id, amount, 'SUCCESS');
        setPaymentStatus('SUCCESS');
        
        // Wait a moment before redirecting
        setTimeout(() => {
             if (currentUser) {
                navigate('/dashboard');
             } else {
                navigate('/');
             }
        }, 2000);
    } else {
        setProcessingStep('Transaction Declined');
        await dataService.processDonation(id, amount, 'FAILED');
        setPaymentStatus('FAILED');
    }
  };

  const handleManualFailure = async () => {
      // Allow user to explicitly simulate a decline
      setPaymentStatus('PROCESSING');
      setProcessingStep('Contacting bank...');
      await new Promise(r => setTimeout(r, 1000));
      await finalizePayment('FAILED');
  };

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
  );
  
  if (!registration) return <div className="p-10 text-center text-red-500 font-medium">Registration not found</div>;

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header / Summary */}
        <div className="mb-8 text-center">
            <Heart className="mx-auto h-12 w-12 text-red-500 fill-current" />
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Secure Donation Gateway</h2>
            <p className="mt-2 text-sm text-slate-600">
                Complete your contribution for <strong className="text-slate-900">{registration.campaignName}</strong>
            </p>
            {!currentUser && (
                <p className="text-xs text-slate-500 mt-1 bg-white inline-block px-2 py-1 rounded border border-slate-200 shadow-sm">Guest Donor: {registration.fullName}</p>
            )}
        </div>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
            
            {/* Left Side: Order Summary */}
            <div className="bg-brand-900 text-white p-8 md:w-1/3 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold mb-6 text-white border-b border-brand-700 pb-2">Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-brand-100 text-sm">
                            <span>Campaign</span>
                            <span className="font-medium text-white text-right">{registration.campaignName}</span>
                        </div>
                        <div className="flex justify-between items-center text-brand-100 text-sm">
                            <span>Donor</span>
                            <span className="font-medium text-white">{registration.fullName}</span>
                        </div>
                        <div className="border-t border-brand-700 my-4"></div>
                        <div className="flex justify-between items-center text-xl font-bold text-white">
                            <span>Total</span>
                            <span>${amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="flex items-center text-xs text-brand-200 bg-brand-800 p-2 rounded-lg">
                        <ShieldCheck className="w-4 h-4 mr-2 text-green-400" />
                        <span>256-bit SSL Encrypted</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Payment Form */}
            <div className="p-8 md:w-2/3 relative bg-white">
                
                {/* Processing Overlay */}
                {paymentStatus === 'PROCESSING' && (
                    <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm">
                        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">{processingStep}</h3>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Please do not close this window.</p>
                    </div>
                )}

                {/* Success Overlay */}
                {paymentStatus === 'SUCCESS' && (
                    <div className="absolute inset-0 bg-green-50 z-20 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">Payment Successful!</h3>
                        <p className="text-slate-600 mt-2 text-lg">Thank you for your generous donation.</p>
                        <p className="text-sm text-slate-400 mt-6 font-medium">Redirecting you shortly...</p>
                    </div>
                )}

                 {/* Failure Overlay */}
                 {paymentStatus === 'FAILED' && (
                    <div className="absolute inset-0 bg-red-50 z-20 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                             <AlertCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Payment Failed</h3>
                        <p className="text-slate-600 mt-2">The transaction was declined.</p>
                        <button 
                            onClick={() => setPaymentStatus('IDLE')}
                            className="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Try Again
                        </button>
                    </div>
                )}


                <form onSubmit={(e) => { e.preventDefault(); simulateProcessing(); }}>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Donation Amount</label>
                        <div className="relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-500 font-semibold text-lg">$</span>
                            </div>
                            <input
                                type="number"
                                min="1"
                                className="bg-white focus:ring-brand-500 focus:border-brand-500 block w-full pl-8 py-3 text-lg border-slate-300 rounded-lg border text-slate-900 placeholder-slate-400 font-semibold"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                disabled={paymentStatus !== 'IDLE'}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                         <div className="flex items-center justify-between mb-2">
                             <label className="block text-sm font-bold text-slate-700">Card Details</label>
                             <div className="flex space-x-1 grayscale opacity-70">
                                 <div className="w-10 h-6 bg-slate-200 rounded border border-slate-300"></div>
                                 <div className="w-10 h-6 bg-slate-200 rounded border border-slate-300"></div>
                                 <div className="w-10 h-6 bg-slate-200 rounded border border-slate-300"></div>
                             </div>
                         </div>
                         <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="relative">
                                <CreditCard className="absolute top-3.5 left-3.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    className="bg-white pl-11 block w-full border-slate-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm py-3 border text-slate-900 placeholder-slate-400"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    maxLength={19}
                                    required
                                    disabled={paymentStatus !== 'IDLE'}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="MM / YY"
                                    className="bg-white block w-full border-slate-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm py-3 px-4 border text-slate-900 placeholder-slate-400"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    maxLength={5}
                                    required
                                    disabled={paymentStatus !== 'IDLE'}
                                />
                                <div className="relative">
                                    <Lock className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="CVC"
                                        className="bg-white pl-10 block w-full border-slate-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm py-3 border text-slate-900 placeholder-slate-400"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value)}
                                        maxLength={4}
                                        required
                                        disabled={paymentStatus !== 'IDLE'}
                                    />
                                </div>
                            </div>
                            
                            <input
                                type="text"
                                placeholder="Name on Card"
                                className="bg-white block w-full border-slate-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm py-3 px-4 border text-slate-900 placeholder-slate-400"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                required
                                disabled={paymentStatus !== 'IDLE'}
                            />
                         </div>
                    </div>

                    <button
                        type="submit"
                        disabled={paymentStatus !== 'IDLE'}
                        className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
                    >
                        Pay ${amount.toFixed(2)}
                    </button>
                </form>

                <div className="mt-8 flex justify-between items-center text-xs">
                     <button 
                        type="button"
                        onClick={handleManualFailure}
                        className="text-red-500 hover:text-red-700 underline font-medium"
                        disabled={paymentStatus !== 'IDLE'}
                     >
                         Simulate Decline
                     </button>

                     <div className="flex items-center space-x-2 text-slate-400">
                        <Lock className="w-3 h-3" />
                        <span>Secure Mock Payment</span>
                     </div>
                </div>

            </div>
        </div>
        
        <div className="text-center mt-8">
            <button 
                onClick={() => navigate(currentUser ? '/dashboard' : '/')}
                className="text-sm text-slate-500 hover:text-slate-800 font-semibold underline decoration-slate-300 hover:decoration-slate-800 transition-all"
            >
                Cancel and return {currentUser ? 'to dashboard' : 'home'}
            </button>
            <p className="text-xs text-slate-400 mt-2">
                Note: Cancelling will leave the donation status as PENDING.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Donation;