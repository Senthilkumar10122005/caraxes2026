import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi there! I'm the Caraxes 2026 assistant. Ask me anything about the event!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput("");
        
        // Prepare history for API (excluding the first greeting to keep it lean, or including it. Let's include everything except current userMsg)
        const history = messages.map(m => ({ role: m.role, content: m.content }));
        
        const newMessages = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Call the backend API
            const response = await axios.post('http://localhost:3000/api/chat', {
                message: userMsg,
                history: history
            });

            setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
        } catch (error) {
            setMessages([...newMessages, { role: 'assistant', content: "Oops, something went wrong. Please contact the organizers!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {isOpen ? (
                <div className="w-[340px] h-[480px] bg-slate-950/80 backdrop-blur-2xl rounded-3xl flex flex-col shadow-[0_0_40px_rgba(14,165,233,0.15)] border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300 transform origin-bottom-right">
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-sky-600 to-indigo-600 p-4 flex justify-between items-center text-white shadow-md">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative flex items-center gap-3">
                            <div className="relative flex items-center justify-center w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm border border-white/20 shadow-inner">
                                <MessageSquare className="w-5 h-5 text-white" />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-sky-600"></div>
                            </div>
                            <div>
                                <span className="font-bold text-base tracking-wide block leading-tight">AI Assistant</span>
                                <span className="text-xs text-sky-100 font-medium">Always online</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="relative hover:bg-white/20 p-1.5 rounded-full transition-colors duration-200">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-950/50 scrollbar-thin scrollbar-thumb-sky-500/20 scrollbar-track-transparent">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-gradient-to-br from-sky-500 to-indigo-500 text-white rounded-tr-sm' 
                                        : 'bg-white/5 backdrop-blur-md text-slate-200 rounded-tl-sm border border-white/5'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] bg-white/5 backdrop-blur-md text-slate-300 rounded-tl-sm border border-white/5 flex items-center gap-3">
                                    <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                                    <span className="animate-pulse">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-slate-950/90 border-t border-white/10 flex gap-2">
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about Caraxes 2026..."
                                className="w-full bg-slate-900/50 text-white border border-white/10 rounded-full pl-5 pr-10 py-3 text-sm focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all placeholder:text-slate-500"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()} 
                            className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-sky-500/25 flex items-center justify-center group"
                        >
                            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative group bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white p-4 rounded-full shadow-[0_0_30px_rgba(14,165,233,0.3)] transition-all duration-300 hover:scale-105 flex items-center justify-center animate-bounce hover:animate-none"
                >
                    <span className="absolute inset-0 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <MessageSquare className="w-7 h-7 relative z-10" />
                    {/* Notification dot */}
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-slate-900"></span>
                    </span>
                </button>
            )}
        </div>
    );
}
