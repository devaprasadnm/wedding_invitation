import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, MapPin, Calendar, Clock } from 'lucide-react';

interface CeremonyEditorProps {
    clientId: string;
}

interface Ceremony {
    id?: string;
    title: string;
    date_time: string;
    venue: string;
    map_url: string;
    notes: string;
}

export default function CeremonyEditor({ clientId }: CeremonyEditorProps) {
    const [ceremonies, setCeremonies] = useState<Ceremony[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCeremonies();
    }, [clientId]);

    const fetchCeremonies = async () => {
        const { data, error } = await supabase
            .from('ceremonies')
            .select('*')
            .eq('client_id', clientId)
            .order('date_time', { ascending: true });

        if (!error && data) {
            setCeremonies(data.map(c => ({
                ...c,
                date_time: c.date_time ? new Date(c.date_time).toISOString().slice(0, 16) : ''
            })));
        }
        setLoading(false);
    };

    const addCeremony = () => {
        setCeremonies([...ceremonies, {
            title: '',
            date_time: '',
            venue: '',
            map_url: '',
            notes: ''
        }]);
    };

    const updateCeremony = (index: number, field: keyof Ceremony, value: string) => {
        const updated = [...ceremonies];
        updated[index] = { ...updated[index], [field]: value };
        setCeremonies(updated);
    };

    const removeCeremony = async (index: number) => {
        const ceremony = ceremonies[index];
        if (ceremony.id) {
            await supabase.from('ceremonies').delete().eq('id', ceremony.id);
        }
        setCeremonies(ceremonies.filter((_, i) => i !== index));
    };

    const saveCeremonies = async () => {
        setSaving(true);
        try {
            for (const ceremony of ceremonies) {
                const ceremonyData = {
                    client_id: clientId,
                    title: ceremony.title,
                    date_time: ceremony.date_time ? new Date(ceremony.date_time).toISOString() : null,
                    venue: ceremony.venue,
                    map_url: ceremony.map_url,
                    notes: ceremony.notes
                };

                if (ceremony.id) {
                    await supabase.from('ceremonies').update(ceremonyData).eq('id', ceremony.id);
                } else {
                    await supabase.from('ceremonies').insert(ceremonyData);
                }
            }
            await fetchCeremonies();
            alert('Events saved successfully!');
        } catch (error: any) {
            alert('Error saving: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-4">Loading events...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Wedding Events</h2>
                <button
                    onClick={addCeremony}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Event
                </button>
            </div>

            {ceremonies.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    No events added yet. Click "Add Event" to create one.
                </div>
            ) : (
                <div className="space-y-4">
                    {ceremonies.map((ceremony, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm text-gray-500 font-medium">Event {index + 1}</span>
                                <button
                                    onClick={() => removeCeremony(index)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Event Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Title
                                    </label>
                                    <select
                                        value={ceremony.title}
                                        onChange={(e) => updateCeremony(index, 'title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select event type...</option>
                                        <option value="Wedding Ceremony">Wedding Ceremony</option>
                                        <option value="Reception">Reception</option>
                                        <option value="Haldi">Haldi</option>
                                        <option value="Mehndi">Mehndi</option>
                                        <option value="Sangeet">Sangeet</option>
                                        <option value="Engagement">Engagement</option>
                                        <option value="Other">Other (Custom)</option>
                                    </select>
                                    {ceremony.title === 'Other' && (
                                        <input
                                            type="text"
                                            placeholder="Enter custom event name"
                                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            onChange={(e) => updateCeremony(index, 'title', e.target.value)}
                                        />
                                    )}
                                </div>

                                {/* Date & Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={ceremony.date_time}
                                        onChange={(e) => updateCeremony(index, 'date_time', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Venue Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        Venue Name
                                    </label>
                                    <input
                                        type="text"
                                        value={ceremony.venue}
                                        onChange={(e) => updateCeremony(index, 'venue', e.target.value)}
                                        placeholder="e.g., Grand Marriott Hotel, Kerala"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Google Maps URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        📍 Google Maps Link
                                    </label>
                                    <input
                                        type="url"
                                        value={ceremony.map_url}
                                        onChange={(e) => updateCeremony(index, 'map_url', e.target.value)}
                                        placeholder="https://maps.google.com/..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Notes */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Additional Notes (optional)
                                    </label>
                                    <textarea
                                        value={ceremony.notes}
                                        onChange={(e) => updateCeremony(index, 'notes', e.target.value)}
                                        placeholder="Dress code, parking info, etc."
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {ceremonies.length > 0 && (
                <div className="flex justify-end">
                    <button
                        onClick={saveCeremonies}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save All Events'}
                    </button>
                </div>
            )}
        </div>
    );
}
