import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, ExternalLink } from 'lucide-react';
import PhotoUploader from '../components/PhotoUploader';
import CeremonyEditor from '../components/CeremonyEditor';

export default function ClientForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        couple_name: '',
        slug: '',
        contact_email: '',
        template_id: 'elegant',
    });

    useEffect(() => {
        if (isEdit) {
            fetchClient();
        }
    }, [id]);

    const fetchClient = async () => {
        const { data } = await supabase.from('clients').select('*').eq('id', id).single();
        if (data) {
            setFormData({
                couple_name: data.couple_name,
                slug: data.slug,
                contact_email: data.contact_email || '',
                template_id: data.template_id || 'elegant',
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = { ...formData };
        if (!payload.slug) {
            payload.slug = payload.couple_name.toLowerCase().replace(/\s+/g, '-');
        }

        let error;
        if (isEdit) {
            const { error: err } = await supabase.from('clients').update(payload).eq('id', id);
            error = err;
        } else {
            const { error: err } = await supabase.from('clients').insert([payload]);
            error = err;
        }

        setLoading(false);
        if (!error) {
            if (!isEdit) {
                navigate('/admin/dashboard');
            } else {
                alert('Saved successfully!');
            }
        } else {
            alert('Error saving client: ' + error.message);
        }
    };

    const previewUrl = formData.slug ? `/invite/${formData.slug}` : null;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Client' : 'New Client'}</h1>
                </div>
                {previewUrl && (
                    <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Preview Invitation
                    </a>
                )}
            </div>

            {/* Basic Info Section */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Couple Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Couple Name</label>
                            <input
                                type="text"
                                value={formData.couple_name}
                                onChange={(e) => setFormData({ ...formData, couple_name: e.target.value })}
                                placeholder="John & Jane"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                    /invite/
                                </span>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:ring-blue-500"
                                    placeholder="john-jane"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                            <input
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                            <select
                                value={formData.template_id}
                                onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                            >
                                <option value="elegant">🌿 Elegant Classic (Gold/Cream)</option>
                                <option value="simple">⬛ Modern Minimal (Black/White)</option>
                                <option value="motion">✨ Motion Story (Dark/Animated)</option>
                                <option value="romantic">💕 Romantic (Heart Frame/Clean)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>{loading ? 'Saving...' : 'Save Client'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Events Section - Only show for existing clients */}
            {isEdit && id && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow border border-gray-100">
                    <CeremonyEditor clientId={id} />
                </div>
            )}

            {/* Photos Section */}
            {isEdit && id && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Photos</h2>
                    <PhotoUploader
                        clientId={id}
                        clientSlug={formData.slug}
                        onUploadComplete={() => alert('Photo uploaded!')}
                    />
                </div>
            )}
        </div>
    );
}

