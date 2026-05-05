import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users, Ticket as TicketIcon, CalendarDays } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import FAQ from '../components/FAQ';
import MapEmbed from '../components/MapEmbed';

const coordinators = [
    { name: 'Senthil Kumar M', role: 'Code Clash Head', dept: 'CSE', phone: '9787395081', email: 'senthilcraxes@gmail.com' },
    { name: 'Harish T', role: 'Hackathon Organizer', dept: 'AI & DS', phone: '9123456780', email: 'harishcraxes@gmail.com' },
    { name: 'Madhan GD', role: 'Paper Presentation', dept: 'IT', phone: '9988776655', email: 'madhancraxes@gmail.com' },
    { name: 'Mohamed Sami H', role: 'Debugging Battle', dept: 'CSE', phone: '9876543212', email: 'samicraxes@gmail.com' },
    { name: 'Karan V', role: 'Web Design', dept: 'CSE', phone: '9443322110', email: 'karancraxes@gmail.com' },
    { name: 'Rohith M', role: 'Treasure Hunt', dept: 'CSE', phone: '9554433221', email: 'rohithcraxes@gmail.com' },
    { name: 'Marwan M', role: 'E-Sports', dept: 'Mechatronics', phone: '9665544332', email: 'marwancraxes@gmail.com' },
    { name: 'Pravin R', role: 'Tech Quiz', dept: 'AI & DS', phone: '9776655443', email: 'pravincraxes@gmail.com' },
    { name: 'Kavin A', role: 'Hospitality', dept: 'IT', phone: '9654321098', email: 'kavincraxes@gmail.com' },
    { name: 'Raghu S', role: 'Entertainments', dept: 'CSE', phone: '9876123450', email: 'raghucraxes@gmail.com' }
];

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    // Visitor Count Logic
    let count = localStorage.getItem('caraxes_visitors');
    if (!count) {
        count = Math.floor(Math.random() * 50) + 100;
    } else {
        count = parseInt(count) + 1;
    }
    localStorage.setItem('caraxes_visitors', count);
    setVisitors(count);

    // Fetch Events
    axios.get('http://localhost:3000/api/events')
      .then(res => {
        setEvents(res.data.events);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div></div>;
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-10">
      {/* Background Blobs for Dashboard */}
      <div className="aurora-blob blob-1 opacity-20"></div>

      <div className="text-center space-y-6 py-8 md:py-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-sky-300 font-medium text-sm backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(14,165,233,0.3)] mx-auto mb-2">
            <span className="animate-pulse">✨</span> WELCOME TO THE DASHBOARD
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white capitalize drop-shadow-lg">
          Participant <span className="text-gradient-aurora">Dashboard</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto px-4 font-light">
          Browse all available technical and non-technical events for Caraxes 2026. Book your seats before they sell out!
        </p>
        
        <div className="pt-8">
            <CountdownTimer />
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-4xl mx-auto aurora-glass-card p-6 md:p-10 rounded-3xl text-center space-y-6 relative z-10 my-16">
          <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">About The Symposium</h3>
          <p className="text-lg text-slate-300 leading-relaxed font-light">
              Our objective is to bring together the brightest minds across colleges to ignite innovation, showcase technical prowess, and inspire excellence in the ever-evolving world of technology.
              Explore our massive roster of Technical and Non-Technical events and browse the Coordinators list below!
          </p>
      </div>

      {/* Events Grid */}
      <div className="relative z-10">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-white">Available <span className="text-gradient-aurora">Events</span></h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="aurora-glass-card flex flex-col group">
              <div className="h-48 overflow-hidden relative border-b border-white/10">
                <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
              </div>
              <div className="p-6 space-y-4 flex flex-col flex-grow relative z-10">
                <div className="space-y-1 flex-grow">
                  <h3 className="text-2xl font-bold text-white group-hover:text-pink-400 transition-colors">{event.title}</h3>
                  <p className="text-sm text-slate-300 font-light line-clamp-2">{event.description}</p>
                </div>
                
                <div className="space-y-2 text-sm text-slate-200 py-4 border-y border-white/10">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-400" /> {new Date(event.date).toLocaleDateString()} at {event.time}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-violet-400" /> {event.location}</div>
                  <div className="flex items-center gap-2"><TicketIcon className="w-4 h-4 text-pink-400" /> {event.ticket_price > 0 ? `$${event.ticket_price}` : 'Free Entry'}</div>
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /> {event.available_seats} / {event.total_seats} Seats Available</div>
                </div>

                <Link to={`/book/${event.id}`} className={`block w-full text-center py-3 rounded-xl font-bold transition-all duration-300 mt-auto ${event.available_seats > 0 ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}>
                  {event.available_seats > 0 ? 'Book Ticket' : 'Sold Out'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-20 relative z-10">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-white">Event <span className="text-gradient-aurora">Coordinators</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {coordinators.map((c, i) => (
                <div key={i} className="aurora-glass-card p-6 flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-full flex items-center justify-center mb-5 text-white font-black text-2xl shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-300 border-2 border-white/20">
                        {c.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-xl text-white mb-1">{c.name}</h3>
                    <p className="text-pink-400 text-sm font-semibold mb-1 uppercase tracking-wider">{c.role}</p>
                    <p className="text-slate-300 font-light text-sm mb-5">{c.dept}</p>
                    <div className="mt-auto space-y-2 text-xs text-slate-200 w-full bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5">
                        <p className="flex items-center justify-center gap-2"><span className="text-cyan-400">📱</span> {c.phone}</p>
                        <p className="flex items-center justify-center gap-2"><span className="text-violet-400">✉️</span> {c.email.split('@')[0]}@...</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
      {/* Map Section */}
      <div className="relative z-10 mt-20">
          <MapEmbed />
      </div>

      {/* FAQ Section */}
      <div className="relative z-10 mt-10">
          <FAQ />
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 text-center py-10 text-slate-400 border-t border-slate-800/50 flex flex-col items-center gap-4 bg-slate-950/50 backdrop-blur-xl mt-20 rounded-t-3xl">
          <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full text-sm font-medium border border-white/10 shadow-lg shadow-sky-900/20">
              <Users className="w-5 h-5 text-violet-400" />
              <span>Total Visitors: <span className="text-white font-bold text-lg">{visitors}</span></span>
          </div>
          <p className="text-sm font-light">&copy; 2026 Caraxes Symposium. All rights reserved.</p>
      </footer>
    </div>
  );
}
