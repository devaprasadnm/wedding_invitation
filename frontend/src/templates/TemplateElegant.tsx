import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, Clock, Navigation, MapPin } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import HeroSlideshow from '../components/HeroSlideshow';
import ImageCardSlider from '../components/ImageCardSlider';
import InviteFooter from '../components/InviteFooter';

interface TemplateProps {
    data: {
        client: any;
        ceremonies: any[];
        photos: any[];
    };
}

export default function TemplateElegant({ data }: TemplateProps) {
    const { client, ceremonies, photos } = data;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    const [rsvpForm, setRsvpForm] = useState({ name: '', email: '', message: '' });
    const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

    const getPhotoUrl = (path: string) =>
        `${supabaseUrl}/storage/v1/object/public/client-photos/${path}`;

    const photoUrls = photos?.map(p => getPhotoUrl(p.storage_path)) || [];
    const heroPhotos = photoUrls.slice(0, 5);


    const handleRsvpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRsvpSubmitted(true);
    };

    const addToCalendar = (event: any) => {
        const startDate = new Date(event.date_time);
        const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&location=${encodeURIComponent(event.venue || '')}&details=${encodeURIComponent(event.notes || '')}`;
        window.open(googleUrl, '_blank');
    };

    const weddingDate = ceremonies && ceremonies.length > 0
        ? new Date(ceremonies[0].date_time).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        : undefined;

    return (
        <div className="min-h-screen bg-[#FFF8E6] text-[#1B3D2F]" style={{ fontFamily: "'Playfair Display', serif" }}>

            {/* SECTION A — Hero Slideshow */}
            {heroPhotos.length > 0 ? (
                <HeroSlideshow
                    images={heroPhotos}
                    coupleName={client.couple_name}
                    subtitle="We're Getting Married"
                    date={weddingDate}
                />
            ) : (
                <section className="h-screen flex items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-[#FFF8E6]">
                    <div className="text-center px-6">
                        <p className="text-sm tracking-[0.3em] uppercase mb-4 text-[#1B3D2F]/70">We're Getting Married</p>
                        <h1 className="text-5xl md:text-7xl italic mb-6">{client.couple_name}</h1>
                        {weddingDate && <p className="text-xl text-[#1B3D2F]/80">{weddingDate}</p>}
                    </div>
                </section>
            )}

            {/* Countdown Timer Section */}
            {ceremonies && ceremonies.length > 0 && (
                <section className="py-14 px-4 bg-[#1B3D2F] text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto text-center"
                    >
                        <h2 className="text-2xl md:text-3xl italic mb-8">Counting Down To Our Day</h2>
                        <CountdownTimer targetDate={ceremonies[0].date_time} />
                    </motion.div>
                </section>
            )}

            {/* SECTION B — Event Cards */}
            <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl text-center mb-16 italic"
                >
                    Celebration Events
                </motion.h2>

                <div className="space-y-6">
                    {ceremonies?.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="bg-white rounded-[20px] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.08)] border border-[#D4AF37]/20"
                        >
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div>
                                    <h3 className="text-2xl md:text-3xl mb-4">{event.title}</h3>

                                    <div className="space-y-3 text-[#4A4A4A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-[#D4AF37]" />
                                            <span>
                                                {new Date(event.date_time).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-[#D4AF37]" />
                                            <span>
                                                {new Date(event.date_time).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </span>
                                        </div>

                                        {event.venue && (
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                                                <span>{event.venue}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {event.map_url && (
                                    <a
                                        href={event.map_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1B3D2F] text-white rounded-full hover:scale-[1.03] hover:shadow-lg transition-all duration-300"
                                    >
                                        <Navigation className="w-4 h-4" />
                                        Get Directions
                                    </a>
                                )}
                                <button
                                    onClick={() => addToCalendar(event)}
                                    className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#D4AF37] text-[#1B3D2F] rounded-full hover:bg-[#D4AF37] hover:text-white hover:scale-[1.03] transition-all duration-300"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Add to Calendar
                                </button>
                            </div>

                            {event.notes && (
                                <p className="mt-6 text-sm text-gray-500 italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {event.notes}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Photos Card Slider */}
            {photoUrls.length > 2 && (
                <section className="py-20 px-4 md:px-8 bg-[#FFF8E6]">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl text-center mb-12 italic"
                    >
                        Featured Moments
                    </motion.h2>
                    <ImageCardSlider images={photoUrls} autoPlay={true} interval={5000} />
                </section>
            )}

            {/* SECTION E — RSVP / Send Blessings */}
            <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#FFF8E6] to-[#FFB6C1]/20">
                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl italic mb-3">Send Your Blessings</h2>
                        <Heart className="w-6 h-6 text-[#FFB6C1] mx-auto" />
                    </motion.div>

                    {rsvpSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[20px] p-10 text-center shadow-xl"
                        >
                            <Heart className="w-14 h-14 text-[#FFB6C1] mx-auto mb-6" />
                            <h3 className="text-2xl mb-3">Thank You!</h3>
                            <p className="text-[#4A4A4A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Your blessings mean the world to us.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            onSubmit={handleRsvpSubmit}
                            className="bg-white rounded-[20px] p-8 shadow-xl space-y-5"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={rsvpForm.name}
                                onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email (optional)"
                                value={rsvpForm.email}
                                onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                            />
                            <textarea
                                placeholder="Your Wishes & Blessings"
                                value={rsvpForm.message}
                                onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                                rows={4}
                                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-none transition-all"
                            />
                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                            >
                                Send Blessings 💕
                            </button>
                        </motion.form>
                    )}
                </div>
            </section>

            {/* Footer */}
            <InviteFooter
                coupleName={client.couple_name}
                weddingDate={weddingDate}
                theme="dark"
            />
        </div>
    );
}
