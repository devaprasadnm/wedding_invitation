import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Calendar, Clock } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import ImageCardSlider from '../components/ImageCardSlider';
import InviteFooter from '../components/InviteFooter';

interface TemplateProps {
    data: {
        client: any;
        ceremonies: any[];
        photos: any[];
    };
}

export default function TemplateMotion({ data }: TemplateProps) {
    const { client, ceremonies, photos } = data;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

    const getPhotoUrl = (path: string) =>
        `${supabaseUrl}/storage/v1/object/public/client-photos/${path}`;

    const photoUrls = photos?.map(p => getPhotoUrl(p.storage_path)) || [];
    const heroPhotos = photoUrls.slice(0, 5);

    // Auto-rotate hero images
    useEffect(() => {
        if (heroPhotos.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentHeroIndex(prev => (prev + 1) % heroPhotos.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [heroPhotos.length]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Hero with Animated Background */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative h-screen flex items-center justify-center"
            >
                {/* Animated Background Images */}
                <AnimatePresence mode="wait">
                    {heroPhotos.length > 0 && (
                        <motion.div
                            key={currentHeroIndex}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{
                                opacity: 0.5,
                                scale: 1,
                                transition: { duration: 1.5 }
                            }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                        >
                            <img
                                src={heroPhotos[currentHeroIndex]}
                                alt="Hero"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />

                {/* Content */}
                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                    >
                        <motion.p
                            className="text-sm tracking-[0.3em] uppercase mb-6 text-gray-400"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            You're Invited To
                        </motion.p>

                        <motion.h1
                            className="text-5xl md:text-8xl font-black mb-8"
                            style={{
                                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                        >
                            {client.couple_name}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-xl text-gray-300"
                        >
                            Are getting married
                        </motion.p>
                    </motion.div>
                </div>

                {/* Animated border frame */}
                <motion.div
                    className="absolute inset-6 md:inset-12 border border-white/10 rounded-3xl pointer-events-none"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                />

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
                        <motion.div
                            className="w-1.5 h-1.5 bg-white rounded-full mx-auto"
                            animate={{ y: [0, 16, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                    </div>
                </motion.div>
            </motion.section>

            {/* Countdown Timer */}
            {ceremonies && ceremonies.length > 0 && (
                <section className="py-16 px-4 bg-gradient-to-b from-black to-purple-950/30">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-xl mx-auto text-center"
                    >
                        <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                            Counting Down
                        </h2>
                        <CountdownTimer targetDate={ceremonies[0].date_time} />
                    </motion.div>
                </section>
            )}

            {/* Events */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-20 px-4 md:px-8"
            >
                <motion.h2
                    variants={itemVariants}
                    className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text"
                >
                    The Events
                </motion.h2>

                <div className="max-w-2xl mx-auto space-y-8">
                    {ceremonies?.map((event) => (
                        <motion.div
                            key={event.id}
                            variants={itemVariants}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-colors"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-purple-400">{event.title}</h3>

                            <div className="space-y-2 text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-purple-400" />
                                    <span>
                                        {new Date(event.date_time).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-400" />
                                    <span>
                                        {new Date(event.date_time).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </span>
                                </div>
                                {event.venue && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-purple-400" />
                                        <span>{event.venue}</span>
                                    </div>
                                )}
                            </div>

                            {event.map_url && (
                                <a
                                    href={event.map_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm hover:bg-purple-500/30 transition-colors"
                                >
                                    Get Directions →
                                </a>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Featured Photos Card Slider */}
            {photoUrls.length > 2 && (
                <section className="py-20 px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-pink-400 to-red-500 text-transparent bg-clip-text"
                    >
                        Featured Moments
                    </motion.h2>
                    <ImageCardSlider images={photoUrls} autoPlay={true} interval={4000} />
                </section>
            )}

            {/* RSVP */}
            <section className="py-20 px-4">
                <div className="max-w-md mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                        Send Love
                    </h2>

                    {rsvpSubmitted ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-8"
                        >
                            <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" />
                            <p className="text-xl">Thank you! 💕</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={(e) => { e.preventDefault(); setRsvpSubmitted(true); }} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                required
                            />
                            <textarea
                                placeholder="Your Message"
                                rows={3}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none transition-colors"
                            />
                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform"
                            >
                                Send ❤️
                            </button>
                        </form>
                    )}
                </div>
            </section>

            {/* Footer */}
            <InviteFooter
                coupleName={client.couple_name}
                theme="gradient"
            />
        </div>
    );
}
