import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Building2, Phone, Mail, Globe } from 'lucide-react';

interface Settings {
    company_name: string;
    company_phone: string;
    company_email: string;
    company_website: string;
    company_address: string;
}

export default function AdminSettings() {
    const [settings, setSettings] = useState<Settings>({
        company_name: 'InviteLeaf',
        company_phone: '',
        company_email: '',
        company_website: '',
        company_address: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data } = await supabase.from('settings').select('*').single();
        if (data) {
            setSettings({
                company_name: data.company_name || 'InviteLeaf',
                company_phone: data.company_phone || '',
                company_email: data.company_email || '',
                company_website: data.company_website || '',
                company_address: data.company_address || ''
            });
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);

        // Check if settings exist
        const { data: existing } = await supabase.from('settings').select('id').single();

        if (existing) {
            await supabase.from('settings').update(settings).eq('id', existing.id);
        } else {
            await supabase.from('settings').insert(settings);
        }

        setSaving(false);
        alert('Settings saved successfully!');
    };

    if (loading) return <div className="p-4">Loading settings...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Company Settings</h1>
                <p className="text-gray-500 text-sm mt-1">These details will appear in the invitation footer</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 space-y-5">
                {/* Company Name */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <Building2 className="w-4 h-4" />
                        Company Name
                    </label>
                    <input
                        type="text"
                        value={settings.company_name}
                        onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="InviteLeaf"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <Phone className="w-4 h-4" />
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={settings.company_phone}
                        onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+91 98765 43210"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <Mail className="w-4 h-4" />
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={settings.company_email}
                        onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="hello@inviteleaf.com"
                    />
                </div>

                {/* Website */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <Globe className="w-4 h-4" />
                        Website URL
                    </label>
                    <input
                        type="url"
                        value={settings.company_website}
                        onChange={(e) => setSettings({ ...settings, company_website: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://inviteleaf.com"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address (optional)
                    </label>
                    <textarea
                        value={settings.company_address}
                        onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={2}
                        placeholder="Your office address..."
                    />
                </div>

                {/* Save Button */}
                <div className="pt-4 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            {/* Preview */}
            <div className="mt-8 p-6 bg-gray-900 text-white rounded-lg">
                <p className="text-xs text-gray-400 mb-3">Footer Preview:</p>
                <div className="flex items-center gap-3 mb-3">
                    <img src="/inviteleaf-logo.png" alt="Logo" className="h-8" />
                    <span className="font-medium">{settings.company_name || 'InviteLeaf'}</span>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                    {settings.company_phone && <p>📞 {settings.company_phone}</p>}
                    {settings.company_email && <p>✉️ {settings.company_email}</p>}
                    {settings.company_website && <p>🌐 {settings.company_website}</p>}
                </div>
            </div>
        </div>
    );
}
