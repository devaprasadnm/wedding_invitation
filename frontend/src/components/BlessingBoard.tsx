import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Send, X, Plus } from 'lucide-react';

interface Blessing {
    id: string;
    name: string;
    message: string;
    created_at: string;
}

interface BlessingBoardProps {
    clientId: string;
    theme?: 'simple' | 'elegant' | 'motion' | 'romantic';
}

export default function BlessingBoard({ clientId, theme = 'simple' }: BlessingBoardProps) {
    const [blessings, setBlessings] = useState<Blessing[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBlessings();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('blessings_channel')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'blessings', filter: `client_id=eq.${clientId}` }, (payload) => {
                setBlessings((prev) => [payload.new as Blessing, ...prev]);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [clientId]);

    const fetchBlessings = async () => {
        const { data } = await supabase
            .from('blessings')
            .select('*')
            .eq('client_id', clientId)
            .order('created_at', { ascending: false });
        if (data) setBlessings(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.message) return;

        setSubmitting(true);
        const { data, error } = await supabase.from('blessings').insert([
            { client_id: clientId, name: formData.name, message: formData.message }
        ]).select();

        if (data) {
            const newBlessing = data[0] as Blessing;
            setBlessings((prev) => [newBlessing, ...prev]);
            setFormData({ name: '', message: '' });
            setShowModal(false);
        } else if (!error) {
            // Fallback if data isn't returned
            fetchBlessings();
            setFormData({ name: '', message: '' });
            setShowModal(false);
        } else {
            console.error('Error sending blessing:', error);
            alert('Error sending blessing');
        }
        setSubmitting(false);
    };

    // Randomize rotation and position slightly for "pinned" look
    const getRandomRotation = () => Math.random() * 6 - 3; // -3 to 3 degrees

    // Theme Configuration
    const styles = {
        simple: {
            board: "bg-gray-100 border-4 border-gray-200 shadow-inner",
            note: "bg-white shadow-md border border-gray-100 text-gray-800",
            button: "border-gray-300 text-gray-600 hover:bg-gray-50",
            font: "font-sans",
            pinColor: "bg-gray-400",
            overlay: null
        },
        elegant: {
            board: "bg-[#1B3D2F] border-8 border-[#D4AF37] shadow-2xl",
            note: "bg-[#FFF8E6] text-[#1B3D2F] shadow-lg border border-[#D4AF37]/20",
            button: "border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10",
            font: "font-serif",
            pinColor: "bg-[#D4AF37]",
            overlay: null
        },
        motion: {
            board: "bg-black/80 backdrop-blur-md border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.2)]",
            note: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl",
            button: "border-purple-500/50 text-purple-400 hover:bg-purple-500/10",
            font: "font-sans",
            pinColor: "bg-gradient-to-r from-purple-500 to-pink-500",
            overlay: null
        },
        romantic: {
            board: "bg-[#fdfbf7] border-8 border-[#eec0c6] shadow-inner",
            note: "bg-[#fff0f5] text-[#865c6c] shadow-md border border-pink-100",
            button: "border-[#eec0c6] text-[#eec0c6] hover:bg-[#fff0f5]",
            font: "font-serif",
            pinColor: "bg-[#eec0c6]",
            overlay: 'url("https://www.transparenttextures.com/patterns/cork-board.png")'
        }
    };

    const currentStyle = styles[theme];

    return (
        <div className={`w-full max-w-6xl mx-auto p-4 ${currentStyle.font}`}>

            {/* The Board */}
            <div className={`relative min-h-[500px] rounded-xl overflow-hidden p-8 ${currentStyle.board}`}>
                {/* Texture Overlay (Optional) */}
                {currentStyle.overlay && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: currentStyle.overlay }}></div>
                )}

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {blessings.map((blessing) => (
                            <motion.div
                                key={blessing.id}
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                    rotate: getRandomRotation()
                                }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
                                className={`relative p-6 pt-8 rounded-sm ${currentStyle.note}`}
                            >
                                {/* Pin */}
                                <div className={`absolute top-[-8px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-sm z-20 ${currentStyle.pinColor}`}></div>

                                <p className="text-lg mb-4 leading-relaxed font-medium">
                                    "{blessing.message}"
                                </p>
                                <p className="text-right text-sm opacity-75 font-bold">
                                    - {blessing.name}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Add Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowModal(true)}
                        className={`flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed rounded-lg transition-all ${currentStyle.button}`}
                    >
                        <Plus className="w-10 h-10 mb-2 opacity-80" />
                        <span className="font-medium tracking-wide">Add Your Blessing</span>
                    </motion.button>
                </div>

                {/* Floating Animation for all cards container (Subtle hover) */}
                {blessings.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="opacity-50 text-xl text-gray-400">Be the first to pin a blessing!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">📌 Send Your Love</h3>
                                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-200 rounded-full text-gray-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/20 focus:outline-none"
                                        placeholder="Guest Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/20 focus:outline-none resize-none"
                                        placeholder="Write your wishes here..."
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? 'Pinning...' : (
                                        <>
                                            <Send className="w-4 h-4" /> Pin It
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
