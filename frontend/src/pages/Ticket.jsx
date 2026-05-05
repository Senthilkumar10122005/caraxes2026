import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Ticket as TicketIcon, Clock, MapPin, CalendarDays, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';

export default function TicketView() {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/bookings/${bookingId}`)
      .then(async (res) => {
        setTicket(res.data.ticket);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [bookingId]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div></div>;
  
  if (!ticket) return (
    <div className="text-center py-20 space-y-4">
      <h2 className="text-3xl font-bold text-white">Ticket Not Found</h2>
      <p className="text-slate-400">The booking ID you provided is invalid or does not exist.</p>
      <Link to="/" className="inline-block px-6 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition">Return Home</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500 py-8">
      <div className="aurora-glass-card rounded-3xl overflow-hidden relative border-t-8 border-t-sky-500 shadow-2xl shadow-sky-900/20">
        
        {/* Ticket Header */}
        <div className="bg-slate-900/80 p-8 border-b border-slate-800/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white uppercase tracking-tight">{ticket.event_name}</h1>
          </div>
          <div className="text-left md:text-right">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm uppercase tracking-wider ${ticket.status === 'VALID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {ticket.status === 'VALID' ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {ticket.status}
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-8 md:flex gap-8 relative items-center">
          {/* Perforated Line Decoration */}
          <div className="hidden md:block absolute left-2/3 top-0 bottom-0 border-l-2 border-dashed border-slate-700"></div>

          <div className="md:w-2/3 space-y-8 pr-0 md:pr-4">
            <div className="space-y-1 block">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Attendee</p>
              <p className="text-3xl font-bold text-white">{ticket.user_name}</p>
              <p className="text-slate-400 text-sm">{ticket.department} • {ticket.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Date</p>
                <div className="flex items-center gap-2 text-white font-medium">
                  <CalendarDays className="w-5 h-5 text-sky-400" />
                  {new Date(ticket.date).toLocaleDateString()}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Time</p>
                <div className="flex items-center gap-2 text-white font-medium">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  {ticket.time}
                </div>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Location</p>
                <div className="flex items-center gap-2 text-white font-medium">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  {ticket.location}
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Booking Reference</p>
                <p className="text-2xl font-mono text-sky-400 font-bold bg-sky-500/10 w-fit px-4 py-2 rounded-lg border border-sky-500/20">{ticket.booking_id}</p>
            </div>
          </div>

          {/* Graphical Entry Identifier right side */}
          <div className="md:w-1/3 flex flex-col justify-center items-center border-t md:border-t-0 border-slate-800 pt-8 md:pt-0 mt-8 md:mt-0 relative z-10 pl-0 md:pl-8">
             <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-900 shadow-2xl relative">
               <ShieldCheck className="w-16 h-16 text-emerald-500" />
               <div className="absolute -bottom-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                  Digital Pass
               </div>
             </div>
             <p className="text-xs text-slate-500 text-center mt-8 font-medium leading-relaxed">
               Show this digital pass <br/> along with your ID<br/> at the front desk.
             </p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8 space-x-4">
          <Link to="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition bg-slate-800/50 px-6 py-3 rounded-full">
              ← Back to Dashboard
          </Link>
          <button onClick={() => window.print()} className="inline-flex items-center text-sm text-sky-400 hover:text-sky-300 transition bg-sky-500/10 border border-sky-500/20 px-6 py-3 rounded-full">
              🖨️ Print Ticket
          </button>
      </div>
    </div>
  );
}
