import { useState } from 'react';
import { motion } from 'framer-motion';

interface PhotoGalleryProps {
    photos: string[];
    onPhotoClick: (index: number) => void;
}

export default function PhotoGallery({ photos, onPhotoClick }: PhotoGalleryProps) {
    const [showAll, setShowAll] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

    const displayedPhotos = showAll ? photos : photos.slice(0, 6);

    const handleImageLoad = (index: number) => {
        setLoadedImages(prev => new Set(prev).add(index));
    };

    return (
        <section className="py-16 px-4 md:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl text-center mb-12 italic font-serif"
                >
                    Our Gallery
                </motion.h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {displayedPhotos.map((photo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                delay: index * 0.08,
                                duration: 0.5,
                                ease: "easeOut"
                            }}
                            className="aspect-square relative overflow-hidden rounded-xl cursor-pointer group"
                            onClick={() => onPhotoClick(index)}
                        >
                            {/* Blur placeholder */}
                            <div
                                className={`absolute inset-0 bg-gray-200 transition-opacity duration-500 ${loadedImages.has(index) ? 'opacity-0' : 'opacity-100'
                                    }`}
                            />

                            {/* Actual Image */}
                            <img
                                src={photo}
                                alt={`Gallery ${index + 1}`}
                                onLoad={() => handleImageLoad(index)}
                                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${loadedImages.has(index)
                                    ? 'blur-0 opacity-100'
                                    : 'blur-sm opacity-0'
                                    }`}
                                loading="lazy"
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </motion.div>
                    ))}
                </div>

                {/* Show More Button */}
                {photos.length > 6 && !showAll && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mt-10"
                    >
                        <button
                            onClick={() => setShowAll(true)}
                            className="px-8 py-3 bg-[#D4AF37] text-white rounded-full hover:bg-[#B8860B] hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            Show All {photos.length} Photos
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
