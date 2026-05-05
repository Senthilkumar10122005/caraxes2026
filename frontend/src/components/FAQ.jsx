import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        question: "When and where is Caraxes 2026?",
        answer: "The symposium is scheduled for March 15th & 16th, 2026 at Veltech University, Chennai."
    },
    {
        question: "Is there any registration fee?",
        answer: "No, registration is completely FREE and open to all college students."
    },
    {
        question: "How do I participate in events?",
        answer: "First, register an account on our website. Then log in, go to the Events dashboard, and book your slots."
    },
    {
        question: "Will accommodation be provided?",
        answer: "Please contact the organizers directly regarding accommodation queries. Use the AI Chatbot to get contact details."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="max-w-3xl mx-auto space-y-4 my-12">
            <h3 className="text-3xl font-bold text-center text-white mb-8">Frequently Asked Questions</h3>
            {faqs.map((faq, idx) => (
                <div key={idx} className="aurora-glass-card rounded-2xl overflow-hidden transition-all duration-300">
                    <button
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-5 text-left text-white hover:bg-white/5 transition-colors"
                    >
                        <span className="font-medium text-lg">{faq.question}</span>
                        {openIndex === idx ? <ChevronUp className="w-5 h-5 text-sky-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </button>
                    <div 
                        className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="p-5 pt-0 text-slate-300">
                            {faq.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
