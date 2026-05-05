import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.phone.length < 10) {
            setError('Phone number must be at least 10 digits');
            toast.error('Phone number must be at least 10 digits');
            return;
        }

        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/auth/register', form);
            toast.success('Registration complete! Please login.');
            navigate('/login');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed';
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    return (
        <div className="max-w-md mx-auto pt-16 animate-in slide-in-from-bottom-4">
            <div className="aurora-glass-card p-8 rounded-2xl border-t-4 border-t-emerald-500 shadow-xl shadow-emerald-900/20">
                <h2 className="text-3xl font-bold mb-6 text-white">Create Account</h2>
                {error && <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-400 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-300">Full Name</label>
                        <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-300">Email</label>
                        <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300">Phone</label>
                            <input required type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300">Department/Year</label>
                            <input required type="text" placeholder="e.g. CSE-3" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white" />
                    </div>
                    <button type="submit" className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20">Register Account</button>
                    <p className="text-center text-slate-400 text-sm mt-4">Already have an account? <Link to="/login" className="text-emerald-400 hover:underline">Login</Link></p>
                </form>
            </div>
        </div>
    );
}
