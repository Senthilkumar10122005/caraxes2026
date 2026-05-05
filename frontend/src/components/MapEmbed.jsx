import React from 'react';
import { MapPin } from 'lucide-react';

export default function MapEmbed() {
    return (
        <div className="max-w-5xl mx-auto my-24 space-y-8 text-center relative px-4">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-sky-500/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

            <div className="space-y-3">
                <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 flex items-center justify-center gap-3">
                    <MapPin className="w-10 h-10 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" /> Event Location
                </h3>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light">
                    Veltech University, Morai, Avadi, Thiruvallur, 600055
                </p>
            </div>
            
            <div className="relative group rounded-3xl overflow-hidden p-[2px] bg-gradient-to-b from-sky-500/50 to-indigo-600/10 hover:from-sky-400/60 hover:to-indigo-500/20 transition-all duration-500 shadow-2xl shadow-sky-900/20">
                <div className="bg-slate-950/80 backdrop-blur-xl rounded-[22px] overflow-hidden h-[450px] relative">
                    <iframe 
                        src="https://maps.google.com/maps?q=Veltech%20University,%20Morai,%20Avadi,%20Thiruvallur,%20600055&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0, filter: 'contrast(1.05) opacity(0.9)' }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="transition-transform duration-700 group-hover:scale-[1.02]"
                    >
                    </iframe>
                    {/* Overlay gradient to blend map edges softly */}
                    <div className="absolute inset-0 border-4 border-slate-900/40 rounded-[22px] pointer-events-none"></div>
                </div>
            </div>
            
            <div className="pt-4">
                <a 
                    href="https://maps.google.com/?q=Veltech+University,+Morai,+Avadi,+Thiruvallur,+600055" 
                    target="_blank" 
                    rel="noreferrer"
                    className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-full font-semibold shadow-lg shadow-sky-500/25 transition-all duration-300 hover:-translate-y-1"
                >
                    <span className="absolute inset-0 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <MapPin className="w-5 h-5" />
                    Get Directions
                </a>
            </div>
        </div>
    );
}
