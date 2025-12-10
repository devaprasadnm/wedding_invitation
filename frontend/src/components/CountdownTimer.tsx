import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    targetDate: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate).getTime() - new Date().getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft(null);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        return <div className="text-center text-lg">The celebration has begun! 🎉</div>;
    }

    return (
        <div className="flex justify-center gap-4 md:gap-6">
            <TimeBlock value={timeLeft.days} label="Days" />
            <TimeBlock value={timeLeft.hours} label="Hours" />
            <TimeBlock value={timeLeft.minutes} label="Minutes" />
            <TimeBlock value={timeLeft.seconds} label="Seconds" />
        </div>
    );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
    return (
        <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 min-w-[60px] md:min-w-[80px]">
                <div className="text-2xl md:text-4xl font-bold">{value.toString().padStart(2, '0')}</div>
            </div>
            <div className="text-xs md:text-sm mt-2 opacity-70">{label}</div>
        </div>
    );
}
