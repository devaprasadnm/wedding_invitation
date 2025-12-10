import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
    images: string[];
    initialIndex: number;
    onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [direction, setDirection] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);

    const goToPrevious = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, goToPrevious, goToNext]);

    // Touch swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;

        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50) {
            if (diff > 0) goToNext();
            else goToPrevious();
        }
        setTouchStart(null);
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        })
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white transition-colors"
            >
                <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 z-50 p-3 text-white/80 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition-all"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 z-50 p-3 text-white/80 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition-all"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image with Swipe */}
            <div
                className="relative w-full h-full flex items-center justify-center px-16"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={(e) => e.stopPropagation()}
            >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.3 },
                            scale: { duration: 0.3 }
                        }}
                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        draggable={false}
                    />
                </AnimatePresence>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Thumbnail Dots */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-4' : 'bg-white/40'
                            }`}
                    />
                ))}
            </div>
        </motion.div>
    );
}
