import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart } from 'lucide-react';
import InviteFooter from '../components/InviteFooter';

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

    const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const getPhotoUrl = (path: string) =>
        `${supabaseUrl}/storage/v1/object/public/client-photos/${path}`;

    const photoUrls = photos?.map(p => getPhotoUrl(p.storage_path)) || [];
    const mainPhoto = photoUrls[0];

    // Auto-rotate gallery
    useEffect(() => {
        if (photoUrls.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentPhotoIndex(prev => (prev + 1) % photoUrls.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [photoUrls.length]);

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
        <div className="min-h-screen bg-white text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>

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

                {/* Heart-Shaped Photo Frame */}
                {mainPhoto && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-10"
                    >
                        {/* Watercolor Heart Background */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: 'radial-gradient(ellipse at center, rgba(144, 238, 144, 0.4) 0%, rgba(60, 179, 113, 0.3) 50%, rgba(34, 139, 34, 0.2) 70%, transparent 100%)',
                                transform: 'scale(1.15)',
                                filter: 'blur(8px)'
                            }}
                        />

                        {/* Decorative Splashes */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-400/30 rounded-full blur-sm" />
                        <div className="absolute -bottom-2 -right-6 w-6 h-6 bg-yellow-400/40 rounded-full blur-sm" />
                        <div className="absolute top-10 -right-8 w-4 h-4 bg-green-500/40 rounded-full blur-sm" />

                        {/* Heart-shaped Image */}
                        <div
                            className="relative w-full h-full overflow-hidden"
                            style={{
                                clipPath: 'path("M 140 20 C 73 20, 20 64, 20 120 C 20 200, 140 256, 140 256 C 140 256, 260 200, 260 120 C 260 64, 207 20, 140 20 Z")',
                                transform: 'scale(0.9)'
                            }}
                        >
                            <img
                                src={mainPhoto}
                                alt="Couple"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Couple Name */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-normal mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    {client.couple_name}
                </motion.h1>

                {/* Wedding Date */}
                {weddingDate && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-500 text-lg mb-10"
                        style={{ fontFamily: "'Inter', sans-serif" }}
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

            {/* Photo Gallery Carousel */}
            {photoUrls.length > 1 && (
                <section className="py-12 bg-gray-50">
                    <div className="max-w-5xl mx-auto px-4">
                        {/* Dots Indicator */}
                        <div className="flex justify-center gap-2 mb-6">
                            {photoUrls.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPhotoIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentPhotoIndex
                                        ? 'bg-gray-800 w-6'
                                        : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Horizontal Gallery */}
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                            {photoUrls.map((photo, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex-shrink-0 w-48 md:w-64 aspect-[3/4] rounded-xl overflow-hidden snap-center transition-transform duration-300 ${index === currentPhotoIndex ? 'scale-105 shadow-xl' : 'scale-100'
                                        }`}
                                >
                                    <img
                                        src={photo}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
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

            {/* Send Blessings Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-md mx-auto text-center">
                    <div className="text-4xl mb-4">🍃</div>

                    {rsvpSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-8"
                        >
                            <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <p className="text-xl">Thank you for your blessings! 💕</p>
                        </motion.div>
                    ) : (
                        <>
                            <button
                                onClick={() => setRsvpSubmitted(true)}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full text-lg font-medium hover:from-red-500 hover:to-red-600 transition-all shadow-lg"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                ✏️ Send Blessings
                            </button>
                        </>
                    )}
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
