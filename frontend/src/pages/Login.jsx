import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', credentials);
            login(res.data.user, res.data.token);
            toast.success('Logged in successfully');
            if(res.data.user.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex flex-col justify-center items-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative px-4">
            {/* Aurora Background Blobs */}
            <div className="aurora-blob blob-1"></div>
            <div className="aurora-blob blob-2"></div>
            
            {/* Landing Hero Section */}
            <div className="text-center space-y-4 relative z-10 w-full max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-sky-300 font-medium text-sm backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(14,165,233,0.3)] mx-auto mb-2">
                    <span className="animate-pulse">🔥</span> SIGN IN TO EXPLORE 🎉
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-gradient-aurora uppercase drop-shadow-2xl">
                    CARAXES 2026
                </h1>
                <h2 className="text-lg md:text-2xl font-light text-slate-300 tracking-wide mt-2">Ignite Innovation • Inspire Excellence</h2>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md mx-auto relative z-10">
                <div className="aurora-glass-card p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                        <p className="text-sm text-slate-400 mt-1">Sign in as User or Admin</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                            <input 
                                required 
                                type="email" 
                                placeholder="name@college.edu"
                                value={credentials.email} 
                                onChange={e => setCredentials({...credentials, email: e.target.value})} 
                                className="w-full bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 text-white placeholder:text-slate-600 transition-all" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                            <input 
                                required 
                                type="password" 
                                placeholder="••••••••"
                                value={credentials.password} 
                                onChange={e => setCredentials({...credentials, password: e.target.value})} 
                                className="w-full bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 text-white placeholder:text-slate-600 transition-all" 
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full mt-6 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-sky-500/25 flex justify-center items-center disabled:opacity-50"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Login"}
                        </button>
                        
                        <p className="text-center text-slate-400 text-sm mt-6">
                            Don't have an account? <Link to="/register" className="text-pink-400 hover:text-pink-300 font-medium transition-colors hover:underline">Register Now</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
