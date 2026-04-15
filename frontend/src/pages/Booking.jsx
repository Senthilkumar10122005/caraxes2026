import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../AuthContext';
import { Clock, MapPin, CalendarDays, Ticket } from 'lucide-react';

export default function Booking() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3000/api/events')
            .then(res => {
                const found = res.data.events.find(e => e.id.toString() === eventId);
                setEvent(found);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [eventId]);

    const handleConfirmBooking = async () => {
        setBooking(true);
        try {
            const res = await axios.post('http://localhost:3000/api/bookings', { event_id: eventId });
            toast.success(res.data.message);
            navigate(`/ticket/${res.data.booking_id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        } finally {
            setBooking(false);
        }
    };

    if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin w-10 h-10 border-4 border-sky-500 border-t-white rounded-full"></div></div>;
    if (!event) return <div className="text-center py-20 text-xl text-slate-400">Event not found</div>;

    return (
        <div className="max-w-2xl mx-auto pt-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="glass-card rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="h-48 overflow-hidden relative">
                    <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="text-3xl font-black text-white">{event.title}</h2>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                        <div className="bg-slate-900/50 p-4 rounded-xl flex items-center gap-3">
                            <CalendarDays className="w-5 h-5 text-sky-400" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Date</p>
                                <p className="font-semibold text-white">{new Date(event.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl flex items-center gap-3">
                            <Clock className="w-5 h-5 text-indigo-400" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Time</p>
                                <p className="font-semibold text-white">{event.time}</p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-emerald-400" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Location</p>
                                <p className="font-semibold text-white">{event.location}</p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl flex items-center gap-3">
                            <Ticket className="w-5 h-5 text-amber-400" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Price</p>
                                <p className="font-semibold text-white">{event.ticket_price > 0 ? `$${event.ticket_price}` : 'Free'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-sky-500/10 border border-sky-500/20 p-6 rounded-2xl relative overflow-hidden text-center">
                        <h3 className="font-bold text-sky-400 text-lg mb-2">Checkout Details</h3>
                        <p className="text-sm text-slate-300">Your ticket will be automatically generated using your profile data:</p>
                        <div className="mt-4 p-3 bg-black/40 rounded-lg inline-block w-full">
                            <p className="font-bold text-white">{user?.name}</p>
                            <p className="text-sm text-slate-400">{user?.email} • {user?.department}</p>
                        </div>
                    </div>

                    <button 
                        onClick={handleConfirmBooking} 
                        disabled={booking || event.available_seats <= 0}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${event.available_seats > 0 ? 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-lg shadow-sky-500/30' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                    >
                        {booking ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : 'Confirm Booking'}
                    </button>
                    {!booking && <p className="text-center text-xs text-slate-500 mt-4">An E-Ticket will be generated and emailed precisely upon checkout.</p>}
                </div>
            </div>
        </div>
    );
}
