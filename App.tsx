import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import Registration from './pages/Registration';
import Donation from './pages/Donation';
import AdminDashboard from './pages/AdminDashboard';
import GuestDonation from './pages/GuestDonation';
import Navbar from './components/Navbar';
import { User } from './types';
import { authService } from './services/mockApi';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Check for existing session
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setInitializing(false);
  }, []);

  if (initializing) return null;

  return (
    <Router>
      <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
        <Navbar user={user} setUser={setUser} />
        
        <Routes>
          <Route path="/" element={
            user ? (
              user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
            ) : (
              <Login setUser={setUser} />
            )
          } />

          {/* Public Routes */}
          <Route path="/public-donate" element={<GuestDonation />} />
          
          {/* Donation page is now accessible to guests (via ID) */}
          <Route path="/donate/:id" element={<Donation />} />

          {/* User Routes */}
          <Route path="/dashboard" element={
            user && user.role === 'user' ? <UserDashboard user={user} /> : <Navigate to="/" />
          } />
          
          <Route path="/register" element={
            user && user.role === 'user' ? <Registration user={user} /> : <Navigate to="/" />
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;