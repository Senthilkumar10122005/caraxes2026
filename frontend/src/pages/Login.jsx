import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', credentials);
            login(res.data.user, res.data.token);
            toast.success('Logged in successfully');
            if(res.data.user.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto pt-16 animate-in slide-in-from-bottom-4">
            <div className="glass-card p-8 rounded-2xl border-t-4 border-t-sky-500 shadow-xl shadow-sky-900/20">
                <h2 className="text-3xl font-bold mb-6 text-white">Login Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-300">Email</label>
                        <input required type="email" value={credentials.email} onChange={e => setCredentials({...credentials, email: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <input required type="password" value={credentials.password} onChange={e => setCredentials({...credentials, password: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white" />
                    </div>
                    <button type="submit" className="w-full mt-4 bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition">Login</button>
                    <p className="text-center text-slate-400 text-sm mt-4">Don't have an account? <Link to="/register" className="text-sky-400 hover:underline">Register</Link></p>
                </form>
            </div>
        </div>
    );
}
