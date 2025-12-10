import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Phone, Mail, Globe } from 'lucide-react';

interface Settings {
    company_name: string;
    company_phone: string;
    company_email: string;
    company_website: string;
}

interface InviteFooterProps {
    coupleName: string;
    weddingDate?: string;
    theme?: 'light' | 'dark' | 'gradient';
}

export default function InviteFooter({ coupleName, weddingDate, theme = 'dark' }: InviteFooterProps) {
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase.from('settings').select('*').single();
            if (error) {
                console.warn('Could not fetch settings (406 expected if table missing):', error.message);
                return;
            }
            if (data) {
                setSettings(data);
            }
        } catch (err) {
            console.warn('Error fetching settings:', err);
        }
    };

    const bgClass = theme === 'light'
        ? 'bg-white text-gray-800 border-t border-gray-100'
        : theme === 'gradient'
            ? 'bg-gradient-to-t from-black to-purple-950/50 text-white'
            : 'bg-[#1B3D2F] text-white/90';

    return (
        <footer className={`py-12 px-4 ${bgClass}`}>
            <div className="max-w-4xl mx-auto">
                {/* Couple Section */}
                <div className="text-center mb-8">
                    <p className="text-sm italic opacity-70 mb-1">With Love,</p>
                    <p className="text-2xl md:text-3xl font-serif">{coupleName}</p>
                    {weddingDate && (
                        <p className="text-sm opacity-60 mt-2">{weddingDate}</p>
                    )}
                </div>

                {/* Divider */}
                <div className="w-20 h-px bg-current opacity-20 mx-auto mb-8" />

                {/* Company Branding */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 opacity-70">
                        <img
                            src="/inviteleaf-logo.png"
                            alt="InviteLeaf"
                            className="h-6 opacity-80"
                        />
                        <span className="text-sm font-medium">
                            {settings?.company_name || 'InviteLeaf'}
                        </span>
                    </div>

                    {/* Contact Details */}
                    {settings && (
                        <div className="flex flex-wrap justify-center gap-4 text-xs opacity-60">
                            {settings.company_phone && (
                                <a href={`tel:${settings.company_phone}`} className="flex items-center gap-1 hover:opacity-100 transition">
                                    <Phone className="w-3 h-3" />
                                    {settings.company_phone}
                                </a>
                            )}
                            {settings.company_email && (
                                <a href={`mailto:${settings.company_email}`} className="flex items-center gap-1 hover:opacity-100 transition">
                                    <Mail className="w-3 h-3" />
                                    {settings.company_email}
                                </a>
                            )}
                            {settings.company_website && (
                                <a href={settings.company_website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-100 transition">
                                    <Globe className="w-3 h-3" />
                                    {settings.company_website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}
