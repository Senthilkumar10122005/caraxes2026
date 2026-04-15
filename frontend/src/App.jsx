import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CalendarDays, ShieldCheck, LogIn, LayoutDashboard, LogOut } from 'lucide-react';

import { AuthProvider, AuthContext } from './AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import TicketView from './pages/Ticket';
import Admin from './pages/Admin';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <CalendarDays className="h-6 w-6 text-sky-400 group-hover:text-indigo-400 transition-colors" />
            <span className="font-bold text-xl tracking-tight text-white">Caraxes <span className="text-sky-400 group-hover:text-indigo-400 transition-colors">2026</span></span>
          </Link>
          <div className="flex items-center space-x-6">
            {!user ? (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition flex items-center gap-1">
                  <LogIn className="w-4 h-4" /> User Login
                </Link>
                <Link to="/register" className="text-sm font-medium bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 px-4 py-1.5 rounded-full transition">Register</Link>
                <Link to="/login" className="text-sm font-bold text-amber-400 hover:text-amber-300 transition flex items-center gap-1 ml-4 border-l border-slate-700 pl-4">
                  <ShieldCheck className="w-4 h-4" /> Admin Login
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition flex items-center gap-1">
                  <LayoutDashboard className="w-4 h-4"/> Events
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Admin
                  </Link>
                )}
                <button onClick={logout} className="text-sm font-medium text-rose-400 hover:text-rose-300 transition flex items-center gap-1">
                  <LogOut className="w-4 h-4"/> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const RequireAuth = ({ children, roleRequired }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-white rounded-full"></div></div>;
    if (!user) return <Navigate to="/login" />;
    if (roleRequired && user.role !== roleRequired) return <Navigate to="/dashboard" />;
    return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-sky-500/30">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/ticket/:bookingId" element={<TicketView />} />
              
              {/* Protected User Routes */}
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/book/:eventId" element={<RequireAuth><Booking /></RequireAuth>} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={<RequireAuth roleRequired="admin"><Admin /></RequireAuth>} />
            </Routes>
          </main>
          <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }}} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
