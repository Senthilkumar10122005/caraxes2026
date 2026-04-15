import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';

export default function Home() {
    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-950 to-slate-950 -z-10"></div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-medium text-sm backdrop-blur-md border border-sky-500/20">
                    🔥 FREE REGISTRATION • OPEN TO ALL 🎉
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400 uppercase">
                    CARAXES 2026
                </h1>
                <h2 className="text-2xl font-medium text-slate-300">Ignite Innovation • Inspire Excellence</h2>
                
                <div className="flex justify-center items-center gap-6 text-slate-400 text-sm md:text-base mb-8 font-medium">
                    <span className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-sky-400"/> March 15th & 16th, 2026</span>
                    <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-sky-400"/> Veltech University</span>
                </div>
                
                <div className="flex gap-4 justify-center mt-8">
                    <Link to="/register" className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-sky-500/30">
                        Register Now
                    </Link>
                    <Link to="/login" className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full transition-all">
                        Login
                    </Link>
                </div>
            </div>

            {/* Event Info */}
            <div className="max-w-4xl mx-auto glass-card p-8 rounded-3xl text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">About The Symposium</h3>
                <p className="text-slate-400 leading-relaxed">
                    Our objective is to bring together the brightest minds across colleges to ignite innovation, showcase technical prowess, and inspire excellence in the ever-evolving world of technology.
                    Log in to view our massive roster of Technical and Non-Technical events and browse the Coordinators list!
                </p>
            </div>
            
            {/* Footer */}
            <footer className="text-center py-8 text-slate-500 border-t border-slate-800">
                <p>&copy; 2026 Caraxes Symposium. All rights reserved.</p>
            </footer>
        </div>
    );
}
