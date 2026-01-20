import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { authService } from '../services/mockApi';
import { LogOut, Heart, LayoutDashboard, ShieldCheck, Gift } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  setUser: (u: User | null) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-brand-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            <span className="font-bold text-xl tracking-tight">NSS Initiative</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-brand-100 text-sm hidden sm:block">
                  Welcome, {user.name} ({user.role})
                </span>
                
                {user.role === 'admin' ? (
                   <Link to="/admin" className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-brand-700 transition">
                     <ShieldCheck size={18} />
                     <span>Admin Panel</span>
                   </Link>
                ) : (
                  <Link to="/dashboard" className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-brand-700 transition">
                    <LayoutDashboard size={18} />
                    <span>My Dashboard</span>
                  </Link>
                )}

                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-brand-700 hover:bg-brand-600 px-4 py-2 rounded text-sm transition shadow"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                 <Link 
                   to="/public-donate" 
                   className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-md animate-pulse"
                 >
                   <Gift size={16} />
                   <span>Donate Now</span>
                 </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;