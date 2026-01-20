import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/mockApi';
import { User } from '../types';
import { Lock, User as UserIcon, ArrowRight, Heart } from 'lucide-react';

interface LoginProps {
  setUser: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await authService.login(username);
      if (user) {
        setUser(user);
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid username. Try "admin" or "user".');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-100 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-10 text-center relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="mx-auto h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md shadow-inner border border-white/30">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-brand-100 mt-2 font-medium">Sign in to manage your impact</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>
              <div className="relative rounded-md shadow-sm group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                </div>
                <input
                  type="text"
                  id="username"
                  className="bg-white block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 sm:text-sm transition-shadow duration-200"
                  placeholder="Enter 'admin' or 'user'"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 inline-block">
                Demo Hint: Use <strong className="text-slate-700">admin</strong> or <strong className="text-slate-700">user</strong>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? 'Signing in...' : (
                <span className="flex items-center">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-500 font-medium">
                  Or support us directly
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/public-donate"
                className="w-full flex justify-center items-center py-3 px-4 border-2 border-brand-100 rounded-lg shadow-sm text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 hover:border-brand-200 transition-colors duration-200 group"
              >
                <Heart className="mr-2 h-4 w-4 text-red-500 group-hover:scale-110 transition-transform" />
                Donate without Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;