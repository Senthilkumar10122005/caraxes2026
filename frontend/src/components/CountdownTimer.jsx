import React, { useState, useEffect } from 'react';

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date("March 15, 2026 09:00:00").getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const timeBlocks = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
    ];

    return (
        <div className="flex justify-center gap-4 text-center my-8">
            {timeBlocks.map((block, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 glass-card rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-lg shadow-sky-900/20 border border-sky-500/20">
                        {block.value.toString().padStart(2, '0')}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-400 mt-2 uppercase tracking-wider">{block.label}</span>
                </div>
            ))}
        </div>
    );
}
