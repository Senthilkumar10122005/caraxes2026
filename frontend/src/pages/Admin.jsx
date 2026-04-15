import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Download, TextCursorInput, ClipboardList, CheckCircle, CalendarPlus, Users, Trash2, TrendingUp, Calendar, Users2 } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('bookings');
  
  const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, totalBookings: 0 });
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [eventForm, setEventForm] = useState({ title: '', description: '', image: '', date: '', time: '', location: '', ticket_price: '0.00', total_seats: '' });
  const [manualTicket, setManualTicket] = useState('');
  const fetchStats = () => axios.get('http://localhost:3000/api/admin/stats').then(res => setStats(res.data.stats)).catch(console.error);
  const fetchBookings = () => axios.get('http://localhost:3000/api/admin/bookings').then(res => setBookings(res.data.bookings)).catch(console.error);
  const fetchEvents = () => axios.get('http://localhost:3000/api/events').then(res => setEvents(res.data.events)).catch(console.error);
  const fetchUsers = () => axios.get('http://localhost:3000/api/admin/users').then(res => setUsers(res.data.users)).catch(console.error);

  useEffect(() => {
    fetchStats();
    fetchBookings();
    fetchEvents();
    fetchUsers();
  }, []);

  const handleManualScan = async (e) => {
    e.preventDefault();
    if (!manualTicket) return;
    try {
        const res = await axios.post('http://localhost:3000/api/admin/scan', { booking_id: manualTicket.trim() });
        toast.success(res.data.message);
        setManualTicket('');
        fetchBookings();
    } catch(err) {
        toast.error(err.response?.data?.message || 'Invalid Ticket ID');
    }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/admin/events', eventForm);
      toast.success('Event Added successfully!');
      setEventForm({ title: '', description: '', image: '', date: '', time: '', location: '', ticket_price: '0.00', total_seats: '' });
      fetchEvents();
      fetchStats();
    } catch(err) {
      toast.error('Failed to add event');
    }
  }

  const deleteEvent = async (id) => {
    if(!window.confirm("Are you sure you want to delete this event? This will also delete all registered bookings for it!")) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/events/${id}`);
      toast.success('Event Deleted');
      fetchEvents();
      fetchBookings();
      fetchStats();
    } catch(err) {
      toast.error('Failed to delete event');
    }
  }

  const deleteUser = async (id) => {
    if(!window.confirm("WARNING: This will permanently delete the user and ALL their bookings! Proceed?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${id}`);
      toast.success('User Deleted');
      fetchUsers();
      fetchBookings();
      fetchStats();
    } catch(err) {
      toast.error('Failed to delete user');
    }
  }

  const exportCSV = () => {
    const headers = "Booking ID,Event Name,User Name,Email,Phone,Department,Status,Booked At\n";
    const csv = bookings.map(b => `${b.booking_id},"${b.event_name}","${b.user_name}","${b.email}","${b.phone}","${b.department}",${b.status},${new Date(b.created_at).toLocaleString()}`).join("\n");
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'caraxes_bookings.csv'; a.click();
  };

  const TabBtn = ({id, icon: Icon, label}) => (
    <button onClick={() => setActiveTab(id)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${activeTab === id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}>
        <Icon className="w-4 h-4" /> {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 pb-4">
        <div>
           <h1 className="text-3xl font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Admin Control</h1>
           <p className="text-slate-400 mt-2">Manage events, supervise users, and oversee entry gates.</p>
        </div>
      </div>

      {/* Aggregate Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass-card p-6 rounded-2xl border-t-4 border-t-emerald-500 flex items-center justify-between">
            <div>
                <p className="text-slate-400 font-medium text-sm">Total Bookings</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.totalBookings}</h3>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-full"><TrendingUp className="w-8 h-8 text-emerald-400" /></div>
        </div>
        <div className="glass-card p-6 rounded-2xl border-t-4 border-t-sky-500 flex items-center justify-between">
            <div>
                <p className="text-slate-400 font-medium text-sm">Registered Users</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</h3>
            </div>
            <div className="p-4 bg-sky-500/10 rounded-full"><Users2 className="w-8 h-8 text-sky-400" /></div>
        </div>
        <div className="glass-card p-6 rounded-2xl border-t-4 border-t-indigo-500 flex items-center justify-between">
            <div>
                <p className="text-slate-400 font-medium text-sm">Live Events</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.totalEvents}</h3>
            </div>
            <div className="p-4 bg-indigo-500/10 rounded-full"><Calendar className="w-8 h-8 text-indigo-400" /></div>
        </div>
      </div>

      <div className="border-b border-slate-800 pb-4">
        <div className="flex flex-wrap gap-2">
           <TabBtn id="bookings" icon={ClipboardList} label="Bookings" />
           <TabBtn id="scanner" icon={TextCursorInput} label="Validate Entry" />
           <TabBtn id="events" icon={CalendarPlus} label="Events Setup" />
           <TabBtn id="users" icon={Users} label="Auth Users" />
        </div>
      </div>

      <div className="animate-in fade-in transition-all">
        {activeTab === 'bookings' && (
            <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h2 className="font-semibold text-lg text-white">All Bookings</h2>
                <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-sky-500 hover:bg-sky-400 rounded-lg transition text-white shadow-md">
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs uppercase bg-slate-900 sticky top-0 z-10 text-slate-400">
                    <tr>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Participant</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-800/50 transition-colors bg-black/20">
                        <td className="px-6 py-4 font-mono text-sky-400">{b.booking_id}</td>
                        <td className="px-6 py-4">
                        <div className="font-bold text-white">{b.user_name}</div>
                        <div className="text-xs text-slate-500">{b.email} • {b.department}</div>
                        </td>
                        <td className="px-6 py-4">
                        <div className="font-medium text-slate-200">{b.event_name}</div>
                        <div className="text-xs text-slate-500">{new Date(b.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 flex w-fit items-center gap-1.5 rounded-full text-xs font-bold ${b.status === 'VALID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {b.status === 'VALID' ? <CheckCircle className="w-3 h-3"/> : null} {b.status}
                        </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
                {bookings.length === 0 && <div className="text-center py-10 text-slate-500">No bookings found.</div>}
            </div>
            </div>
        )}

        {activeTab === 'scanner' && (
            <div className="glass-card p-8 rounded-xl border border-slate-800 max-w-md mx-auto shadow-2xl">
                <h2 className="text-xl font-bold text-center mb-6 text-white uppercase tracking-widest"><TextCursorInput className="inline w-5 h-5 mb-1 text-sky-400"/> Validate Ticket ID</h2>
                <form onSubmit={handleManualScan} className="space-y-4">
                    <input 
                        type="text" 
                        required 
                        placeholder="e.g. TKT-ABC123XYZ" 
                        value={manualTicket} 
                        onChange={e => setManualTicket(e.target.value)} 
                        className="w-full bg-slate-900 border-2 border-slate-700/50 rounded-xl px-6 py-4 text-center font-mono text-lg text-sky-400 tracking-wider focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                    />
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black tracking-widest uppercase py-4 rounded-xl transition shadow-lg shadow-emerald-500/20">
                        Check-in User
                    </button>
                </form>
                <p className="text-center text-sm text-slate-400 mt-6">Type the Booking Reference manually to securely mark the user as 'USED' and authorize entry.</p>
            </div>
        )}

        {activeTab === 'events' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 glass-card p-6 rounded-xl h-fit border-t-4 border-sky-500">
                    <h2 className="text-xl font-bold text-white mb-6">Create Event</h2>
                    <form onSubmit={addEvent} className="space-y-4">
                        <input required type="text" placeholder="Title" value={eventForm.title} onChange={e=>setEventForm({...eventForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 text-sm" />
                        <textarea required placeholder="Description" value={eventForm.description} onChange={e=>setEventForm({...eventForm, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 text-sm h-24" />
                        <input type="text" placeholder="Image URL (Optional)" value={eventForm.image} onChange={e=>setEventForm({...eventForm, image: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 text-sm" />
                        <div className="grid grid-cols-2 gap-2">
                            <input required type="date" value={eventForm.date} onChange={e=>setEventForm({...eventForm, date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 text-sm" />
                            <input required type="text" placeholder="Time (e.g. 10:00 AM)" value={eventForm.time} onChange={e=>setEventForm({...eventForm, time: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 text-sm" />
                        </div>
                        <input required type="text" placeholder="Location" value={eventForm.location} onChange={e=>setEventForm({...eventForm, location: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 text-sm" />
                        <div className="grid grid-cols-2 gap-2">
                            <input required type="number" step="0.01" placeholder="Price ($)" value={eventForm.ticket_price} onChange={e=>setEventForm({...eventForm, ticket_price: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 text-sm" />
                            <input required type="number" placeholder="Total Seats" value={eventForm.total_seats} onChange={e=>setEventForm({...eventForm, total_seats: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 text-sm" />
                        </div>
                        <button type="submit" className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 rounded-xl transition text-sm">Add New Event</button>
                    </form>
                </div>
                
                <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                        <h2 className="font-semibold text-lg text-white">Manage Events ({events.length})</h2>
                    </div>
                    <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
                        {events.map((e) => (
                            <div key={e.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-800/20 transition">
                                <div>
                                    <h3 className="font-bold text-lg text-sky-400">{e.title}</h3>
                                    <p className="text-sm text-slate-400">{new Date(e.date).toLocaleDateString()} at {e.time} • Seats: {e.available_seats}/{e.total_seats} • Price: ${e.ticket_price}</p>
                                </div>
                                <button onClick={() => deleteEvent(e.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 whitespace-nowrap">
                                    <Trash2 className="w-4 h-4"/> Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'users' && (
            <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <h2 className="font-semibold text-lg text-white">Registered Users ({users.length})</h2>
                </div>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs uppercase bg-slate-900 sticky top-0 z-10 text-slate-400">
                        <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Role</th><th className="px-6 py-4 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-800/50 transition-colors bg-black/20 group">
                            <td className="px-6 py-4 font-mono text-slate-500">{u.id}</td>
                            <td className="px-6 py-4">
                                <div className="font-bold text-white">{u.name}</div>
                                <div className="text-xs text-slate-400">{u.email} • {u.department} • {u.phone}</div>
                            </td>
                            <td className="px-6 py-4 uppercase text-xs font-bold">{u.role === 'admin' ? <span className="text-amber-400">Admin</span> : <span className="text-slate-400">User</span>}</td>
                            <td className="px-6 py-4 text-right">
                                {u.role !== 'admin' && (
                                    <button onClick={() => deleteUser(u.id)} className="opacity-0 group-hover:opacity-100 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all">
                                        <Trash2 className="w-4 h-4"/>
                                    </button>
                                )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
