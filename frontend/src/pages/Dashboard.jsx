import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users, Ticket as TicketIcon } from 'lucide-react';

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

  useEffect(() => {
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white capitalize">
          Participant <span className="text-sky-400">Dashboard</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto px-4">
          Browse all available technical and non-technical events for Caraxes 2026. Book your seats before they sell out!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
            </div>
            <div className="p-6 space-y-4 flex flex-col flex-grow">
              <div className="space-y-1 flex-grow">
                <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2">{event.description}</p>
              </div>
              
              <div className="space-y-2 text-sm text-slate-300 py-4 border-y border-slate-800">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-sky-400" /> {new Date(event.date).toLocaleDateString()} at {event.time}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sky-400" /> {event.location}</div>
                <div className="flex items-center gap-2"><TicketIcon className="w-4 h-4 text-amber-400" /> {event.ticket_price > 0 ? `$${event.ticket_price}` : 'Free Entry'}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /> {event.available_seats} / {event.total_seats} Seats Available</div>
              </div>

              <Link to={`/book/${event.id}`} className={`block w-full text-center py-3 rounded-lg font-semibold transition-all mt-auto ${event.available_seats > 0 ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                {event.available_seats > 0 ? 'Book Ticket' : 'Sold Out'}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-16 border-t border-slate-800">
        <h2 className="text-3xl font-bold text-center mb-10 text-white"><span className="text-sky-400">Event</span> Coordinators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {coordinators.map((c, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center hover:-translate-y-1 transition-transform border-t-4 border-t-slate-700 hover:border-t-sky-400">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-sky-400 font-bold text-xl">
                        {c.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-lg text-white mb-1">{c.name}</h3>
                    <p className="text-sky-400 text-sm font-medium mb-1">{c.role}</p>
                    <p className="text-slate-500 text-xs mb-4">{c.dept}</p>
                    <div className="mt-auto space-y-1 text-xs text-slate-400 w-full bg-slate-900/50 p-2 rounded-lg">
                        <p>📱 {c.phone}</p>
                        <p>✉️ {c.email.split('@')[0]}@...</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
