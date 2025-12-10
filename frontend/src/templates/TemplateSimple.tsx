import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ExternalLink } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import ImageCardSlider from '../components/ImageCardSlider';
import InviteFooter from '../components/InviteFooter';
import BlessingBoard from '../components/BlessingBoard';

interface TemplateProps {
    data: {
        client: any;
        ceremonies: any[];
        photos: any[];
    };
}

export default function TemplateSimple({ data }: TemplateProps) {
    const { client, ceremonies, photos } = data;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;



    const getPhotoUrl = (path: string) =>
        `${supabaseUrl}/storage/v1/object/public/client-photos/${path}`;

    const photoUrls = photos?.map(p => getPhotoUrl(p.storage_path)) || [];
    const heroPhoto = photoUrls[0];

    return (
        <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative h-[75vh] md:h-[85vh]"
            >
                {heroPhoto ? (
                    <motion.img
                        src={heroPhoto}
                        alt="Hero"
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                )}

                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-6">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs tracking-[0.25em] uppercase mb-4 opacity-80"
                    >
                        Wedding Invitation
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-4xl md:text-6xl font-bold mb-4"
                    >
                        {client.couple_name}
                    </motion.h1>

                    {ceremonies && ceremonies.length > 0 && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-lg opacity-90"
                        >
                            {new Date(ceremonies[0].date_time).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </motion.p>
                    )}
                </div>
            </motion.section>

            {/* Countdown Timer */}
            {ceremonies && ceremonies.length > 0 && (
                <section className="py-12 px-4 bg-black text-white">
                    <div className="max-w-xl mx-auto text-center">
                        <h2 className="text-xl font-bold mb-6">Counting Down</h2>
                        <CountdownTimer targetDate={ceremonies[0].date_time} />
                    </div>
                </section>
            )}

            {/* Events Section */}
            <section className="py-16 px-4 md:px-8 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Events</h2>

                <div className="space-y-4">
                    {ceremonies?.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                        >
                            <h3 className="text-xl font-bold mb-3">{event.title}</h3>

                            <div className="space-y-2 text-gray-600 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(event.date_time).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
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
                                        <MapPin className="w-4 h-4" />
                                        <span>{event.venue}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {event.map_url && (
                                    <a
                                        href={event.map_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Directions
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Photos Card Slider */}
            {photoUrls.length > 2 && (
                <section className="py-16 px-4 md:px-8 bg-gray-50">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Featured Moments</h2>
                        <ImageCardSlider images={photoUrls} autoPlay={true} interval={4000} />
                    </div>
                </section>
            )}

            {/* RSVP Section -> Blessing Board */}
            <section className="py-16 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Send Blessings</h2>
                    <p className="text-gray-500 text-center mb-10">Share your wishes with us</p>
                    <BlessingBoard clientId={client.id} theme="simple" />
                </div>
            </section>

            {/* Footer */}
            <InviteFooter
                coupleName={client.couple_name}
                theme="light"
            />
        </div>
    );
}
