import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../AuthContext';
import { Clock, MapPin, CalendarDays, Ticket, BookOpen, Users } from 'lucide-react';

const EVENT_RULES = {
    'Code Clash': {
        requiresTeam: false,
        rules: [
            "Individual participation only.",
            "Bring your own laptop.",
            "Internet access is restricted during the coding phase.",
            "Plagiarism will lead to immediate disqualification."
        ]
    },
    'Hackathon': {
        requiresTeam: true,
        maxMembers: 4,
        rules: [
            "Team size must be between 2 and 4 members.",
            "All members must carry their ID cards.",
            "Problem statements will be provided on the spot.",
            "Final pitch must include a working prototype."
        ]
    },
    'Paper Presentation': {
        requiresTeam: true,
        maxMembers: 2,
        rules: [
            "Maximum 2 members per team.",
            "Papers must follow IEEE format.",
            "Presentation time is strictly 10 minutes + 2 mins Q&A.",
            "Submit softcopy on the day of the event."
        ]
    },
    'Treasure Hunt': {
        requiresTeam: true,
        maxMembers: 5,
        rules: [
            "Teams can have up to 5 members.",
            "Clues are hidden across the campus.",
            "Use of external help or internet is prohibited.",
            "First team to find the final treasure wins."
        ]
    },
    'Quiz Mania': {
        requiresTeam: true,
        maxMembers: 2,
        rules: [
            "Teams of 2 members.",
            "Prelims will be a written test.",
            "Top 6 teams qualify for the finals.",
            "Quiz master's decision is final."
        ]
    },
    'Debugging Battle': {
        requiresTeam: false,
        rules: [
            "Individual event.",
            "Languages allowed: C, C++, Java, Python.",
            "Time limit for each round is strictly enforced.",
            "Using IDE debuggers is allowed."
        ]
    },
    'Web Design': {
        requiresTeam: false,
        rules: [
            "Individual event.",
            "Only HTML, CSS, JS allowed (No frameworks unless specified).",
            "Internet access allowed for assets only.",
            "Judging based on UI/UX and responsiveness."
        ]
    },
    'E-Sports': {
        requiresTeam: true,
        maxMembers: 5,
        rules: [
            "Squad of 5 members.",
            "Bring your own devices and accessories.",
            "Use of emulators or hacks is strictly banned.",
            "Toxic behavior will result in disqualification."
        ]
    }
};

export default function Booking() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState(1);
    const [teamMemberNames, setTeamMemberNames] = useState('');
    const [contactEmail, setContactEmail] = useState(user?.email || '');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);

    useEffect(() => {
        axios.get('http://localhost:3000/api/events')
            .then(res => {
                const found = res.data.events.find(e => e.id.toString() === eventId);
                setEvent(found);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [eventId]);

    const handleSendOtp = async () => {
        const eventRules = event ? EVENT_RULES[event.title] : null;
        if (eventRules?.requiresTeam && (!teamName || teamMembers < 2 || !teamMemberNames)) {
            toast.error("Please fill all team details including member names.");
            return;
        }
        if (!contactEmail) {
            toast.error("Contact email is required.");
            return;
        }

        setBooking(true);
        try {
            await axios.post('http://localhost:3000/api/bookings/send-otp', { contact_email: contactEmail });
            toast.success("OTP sent to " + contactEmail);
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setBooking(false);
        }
    };

    const handleConfirmBooking = async () => {
        if (!otp) {
            toast.error("Please enter the OTP.");
            return;
        }

        setBooking(true);
        try {
            const res = await axios.post('http://localhost:3000/api/bookings', { 
                event_id: eventId,
                team_name: teamName || null,
                team_members: EVENT_RULES[event.title]?.requiresTeam ? teamMembers : 1,
                team_member_names: teamMemberNames || null,
                contact_email: contactEmail,
                otp: otp
            });
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
            <div className="aurora-glass-card rounded-3xl overflow-hidden shadow-2xl relative">
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

                    <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-5 h-5 text-pink-400" />
                            <h3 className="font-bold text-white text-lg">Rulebook & Guidelines</h3>
                        </div>
                        <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
                            {event && EVENT_RULES[event.title]?.rules.map((rule, idx) => (
                                <li key={idx}>{rule}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-sky-500/10 border border-sky-500/20 p-6 rounded-2xl relative overflow-hidden">
                        <h3 className="font-bold text-sky-400 text-lg mb-2 text-center">Checkout Details</h3>
                        <p className="text-sm text-slate-300 text-center">Please verify your details and provide a contact email for the E-Ticket.</p>
                        
                        {step === 1 ? (
                            <div className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Ticket Contact Email *</label>
                                    <input 
                                        type="email" 
                                        placeholder="Where should we send the ticket?"
                                        value={contactEmail}
                                        onChange={e => setContactEmail(e.target.value)}
                                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-white" 
                                    />
                                    <p className="text-xs text-slate-500 mt-1">We will send an OTP to this email to verify.</p>
                                </div>

                                {event && EVENT_RULES[event.title]?.requiresTeam && (
                                    <>
                                        <div className="flex items-center gap-2 mb-2 mt-6">
                                            <Users className="w-5 h-5 text-sky-400" />
                                            <h4 className="font-bold text-white">Team Registration Required</h4>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Team Name *</label>
                                            <input 
                                                type="text" 
                                                placeholder="Enter your team name"
                                                value={teamName}
                                                onChange={e => setTeamName(e.target.value)}
                                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-white" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Number of Members (Max: {EVENT_RULES[event.title].maxMembers}) *</label>
                                            <input 
                                                type="number" 
                                                min="2" 
                                                max={EVENT_RULES[event.title].maxMembers}
                                                value={teamMembers}
                                                onChange={e => setTeamMembers(parseInt(e.target.value))}
                                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-white" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Team Member Names *</label>
                                            <textarea 
                                                placeholder="E.g., John Doe, Jane Smith..."
                                                value={teamMemberNames}
                                                onChange={e => setTeamMemberNames(e.target.value)}
                                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-white min-h-[80px]" 
                                            ></textarea>
                                        </div>
                                    </>
                                )}

                                <button 
                                    onClick={handleSendOtp} 
                                    disabled={booking || event.available_seats <= 0}
                                    className={`w-full mt-4 py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${event.available_seats > 0 ? 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-lg shadow-sky-500/30' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                                >
                                    {booking ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : 'Next (Send OTP)'}
                                </button>
                            </div>
                        ) : (
                            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-right-4">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center mb-6">
                                    <p className="text-emerald-400 font-medium">OTP sent to {contactEmail}</p>
                                    <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white underline mt-1">Change Email</button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5 text-center">Enter 6-Digit OTP *</label>
                                    <input 
                                        type="text" 
                                        maxLength="6"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        className="w-full text-center tracking-widest text-2xl font-bold bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-white" 
                                    />
                                </div>
                                <button 
                                    onClick={handleConfirmBooking} 
                                    disabled={booking}
                                    className="w-full mt-4 py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/30"
                                >
                                    {booking ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : 'Verify & Confirm Booking'}
                                </button>
                            </div>
                        )}
                    </div>
                    {!booking && <p className="text-center text-xs text-slate-500 mt-4">An E-Ticket will be generated and emailed precisely upon checkout.</p>}
                </div>
            </div>
        </div>
    );
}
