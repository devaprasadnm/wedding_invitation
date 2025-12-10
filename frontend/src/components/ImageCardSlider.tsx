import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCardSliderProps {
    images: string[];
    autoPlay?: boolean;
    interval?: number;
}

export default function ImageCardSlider({
    images,
    autoPlay = true,
    interval = 4000
}: ImageCardSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);

    const goToPrevious = useCallback(() => {
        setDirection(-1);
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    // Auto-play
    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;
        const timer = setInterval(goToNext, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, goToNext, images.length]);

    // Touch handlers for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const diff = touchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToNext();
            else goToPrevious();
        }
        setTouchStart(null);
    };

    const cardVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 400 : -400,
            opacity: 0,
            scale: 0.85,
            rotateY: direction > 0 ? 15 : -15
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 400 : -400,
            opacity: 0,
            scale: 0.85,
            rotateY: direction < 0 ? 15 : -15
        })
    };

    if (images.length === 0) return null;

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Main Slider */}
            <div
                className="relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl"
                style={{ perspective: '1200px' }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={cardVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.4 },
                            scale: { duration: 0.4 },
                            rotateY: { duration: 0.4 }
                        }}
                        className="absolute inset-0"
                    >
                        {/* Card Container */}
                        <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                            <img
                                src={images[currentIndex]}
                                alt={`Slide ${currentIndex + 1}`}
                                className="w-full h-full object-cover"
                                draggable={false}
                            />

                            {/* Card Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-800" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-800" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Cards */}
            {images.length > 1 && (
                <div className="flex justify-center gap-3 mt-6 px-4 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <motion.button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-300 ${index === currentIndex
                                    ? 'ring-2 ring-[#D4AF37] ring-offset-2 scale-105'
                                    : 'opacity-60 hover:opacity-100'
                                }`}
                            whileHover={{ scale: index === currentIndex ? 1.05 : 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img
                                src={image}
                                alt={`Thumb ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Dots Indicator */}
            {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'w-8 bg-[#D4AF37]'
                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
