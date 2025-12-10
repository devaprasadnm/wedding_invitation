import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import InviteFooter from '../components/InviteFooter';
import ImageCardSlider from '../components/ImageCardSlider';
import BlessingBoard from '../components/BlessingBoard';

interface TemplateProps {
    data: {
        client: any;
        ceremonies: any[];
        photos: any[];
    };
}

export default function TemplateRomantic({ data }: TemplateProps) {
    const { client, ceremonies, photos } = data;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;




    const getPhotoUrl = (path: string) =>
        `${supabaseUrl}/storage/v1/object/public/client-photos/${path}`;

    const photoUrls = photos?.map(p => getPhotoUrl(p.storage_path)) || [];
    const mainPhoto = photoUrls[0];



    const weddingDate = ceremonies && ceremonies.length > 0
        ? new Date(ceremonies[0].date_time).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : undefined;

    const addToCalendar = (event: any) => {
        const startDate = new Date(event.date_time);
        const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&location=${encodeURIComponent(event.venue || '')}&details=${encodeURIComponent(event.notes || '')}`;
        window.open(googleUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-gray-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>

            {/* Hero Section */}
            <section className="py-12 px-4 text-center">
                {/* Decorative Icon */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl mb-8 text-gray-400"
                >
                    ✿
                </motion.div>

                {/* Splatter/Brush-Shaped Photo Frame */}
                {mainPhoto && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-72 h-72 md:w-96 md:h-96 mx-auto mb-12"
                    >
                        {/* Watercolor Background Elements */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.2) 0%, rgba(230, 200, 100, 0.15) 40%, transparent 70%)',
                                transform: 'scale(1.2)',
                                filter: 'blur(20px)'
                            }}
                        />

                        {/* Paint Splatter Image Mask */}
                        <div className="relative w-full h-full drop-shadow-2xl">
                            <div
                                className="w-full h-full object-cover"
                                style={{
                                    clipPath: 'path("M232.5,22.5 C205.5,12.5 185.5,35.5 165.5,25.5 C145.5,15.5 125.5,45.5 105.5,35.5 C85.5,25.5 65.5,53.5 55.5,75.5 C45.5,95.5 15.5,108.5 25.5,135.5 C35.5,162.5 55.5,182.5 65.5,205.5 C75.5,228.5 55.5,248.5 75.5,268.5 C95.5,288.5 125.5,278.5 150.5,295.5 C175.5,312.5 205.5,298.5 232.5,285.5 C259.5,272.5 275.5,248.5 288.5,225.5 C301.5,202.5 325.5,182.5 315.5,155.5 C305.5,128.5 285.5,105.5 272.5,82.5 C259.5,59.5 259.5,32.5 232.5,22.5 Z")',
                                    transform: 'scale(1.1)',
                                    backgroundColor: '#ddd' // Fallback
                                }}
                            >
                                <img
                                    src={mainPhoto}
                                    alt="Couple"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Gold Accent Strokes (Decorative) */}
                        <svg className="absolute -top-6 -right-6 w-24 h-24 text-[#D4AF37] opacity-60" viewBox="0 0 100 100" fill="currentColor">
                            <path d="M10,50 Q30,20 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="2" />
                            <circle cx="80" cy="20" r="3" />
                            <circle cx="10" cy="80" r="2" />
                        </svg>
                    </motion.div>
                )}

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl font-normal mb-6 text-[#2C2C2C]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                >
                    {client.couple_name}
                </motion.h1>

                {/* Wedding Date */}
                {weddingDate && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-[#666] text-xl mb-12 tracking-widest"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        {weddingDate}
                    </motion.p>
                )}

                {/* Countdown Timer */}
                {ceremonies && ceremonies.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="flex justify-center gap-6 md:gap-10">
                            <CountdownBlock targetDate={ceremonies[0].date_time} />
                        </div>
                    </motion.div>
                )}
            </section>

            {/* Featured Photos (Animated Slider) */}
            {photoUrls.length > 2 && (
                <section className="py-20 px-4 bg-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl text-[#D4AF37]" style={{ fontFamily: "'Great Vibes', cursive" }}>
                            Captured Moments
                        </h2>
                    </motion.div>
                    <ImageCardSlider images={photoUrls} autoPlay={true} interval={4000} />
                </section>
            )}

            {/* Events Section */}
            <section className="py-16 px-4">
                <div className="max-w-2xl mx-auto">
                    {ceremonies?.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center mb-12"
                        >
                            {/* Event Icon */}
                            <div className="text-4xl mb-4">🏛️</div>

                            {/* Date & Time */}
                            <p className="text-purple-600 font-medium mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {new Date(event.date_time).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })} {new Date(event.date_time).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>

                            {/* Event Title & Venue */}
                            <h3 className="text-xl md:text-2xl font-medium mb-2">{event.title}</h3>
                            {event.venue && (
                                <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {event.venue}
                                </p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center gap-3">
                                {event.map_url && (
                                    <a
                                        href={event.map_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                                        style={{ fontFamily: "'Inter', sans-serif" }}
                                    >
                                        <MapPin className="w-4 h-4" />
                                        Get Directions
                                    </a>
                                )}
                                <button
                                    onClick={() => addToCalendar(event)}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                    <Calendar className="w-4 h-4" />
                                    Add to Calendar
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Send Blessings Section (New Board) */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="text-4xl mb-8">🍃</div>
                    <h2 className="text-3xl md:text-5xl font-normal mb-10 text-[#2C2C2C]" style={{ fontFamily: "'Cinzel', serif" }}>
                        Wishes & Blessings
                    </h2>
                    <BlessingBoard clientId={client.id} theme="romantic" />
                </div>
            </section>

            {/* Footer */}
            <InviteFooter
                coupleName={client.couple_name}
                weddingDate={weddingDate}
                theme="light"
            />
        </div>
    );
}

// Countdown Block Component
function CountdownBlock({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculate = () => {
            const diff = new Date(targetDate).getTime() - new Date().getTime();
            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / 1000 / 60) % 60),
                    seconds: Math.floor((diff / 1000) % 60)
                });
            }
        };
        calculate();
        const timer = setInterval(calculate, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <>
            <TimeUnit value={timeLeft.days} label="DAY" />
            <TimeUnit value={timeLeft.hours} label="HOURS" />
            <TimeUnit value={timeLeft.minutes} label="MINUTES" />
            <TimeUnit value={timeLeft.seconds} label="SECOND" />
        </>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="text-center">
            <div className="text-3xl md:text-5xl font-bold text-gray-800">{value}</div>
            <div className="text-xs text-gray-500 tracking-wider mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</div>
        </div>
    );
}
