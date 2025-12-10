import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSlideshowProps {
    images: string[];
    coupleName: string;
    subtitle?: string;
    date?: string;
}

export default function HeroSlideshow({ images, coupleName, subtitle, date }: HeroSlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <section className="relative h-screen md:h-[85vh] overflow-hidden">
            {/* Background Images with Crossfade + Ken Burns */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                            opacity: { duration: 1.5, ease: "easeInOut" },
                            scale: { duration: 8, ease: "linear" }
                        }
                    }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 1.5 }
                    }}
                    className="absolute inset-0"
                >
                    <motion.img
                        src={images[currentIndex]}
                        alt="Hero"
                        className="w-full h-full object-cover"
                        animate={{
                            scale: [1, 1.08],
                            y: [0, -15]
                        }}
                        transition={{
                            duration: 8,
                            ease: "linear"
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 opacity-90"
                    >
                        {subtitle}
                    </motion.p>
                )}

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-serif italic mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    {coupleName}
                </motion.h1>

                {date && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="text-lg md:text-xl opacity-90"
                    >
                        {date}
                    </motion.p>
                )}
            </div>

            {/* Image Indicators */}
            {images.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-white w-8'
                                    : 'bg-white/50 hover:bg-white/80'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2"
            >
                <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </motion.div>
        </section>
    );
}
