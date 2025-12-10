import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import TemplateSimple from '../templates/TemplateSimple';
import TemplateElegant from '../templates/TemplateElegant';
import TemplateMotion from '../templates/TemplateMotion';
import TemplateRomantic from '../templates/TemplateRomantic';

export default function PublicInvite() {
    const { slug } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchInvite();
    }, [slug]);

    const fetchInvite = async () => {
        try {
            // 1. Get Client
            const { data: client, error: clientError } = await supabase
                .from('clients')
                .select('*')
                .eq('slug', slug)
                .single();

            if (clientError || !client) throw new Error('Client not found');

            // 2. Get Ceremonies
            const { data: ceremonies } = await supabase
                .from('ceremonies')
                .select('*')
                .eq('client_id', client.id);

            // 3. Get Photos
            const { data: photos } = await supabase
                .from('photos')
                .select('*')
                .eq('client_id', client.id);

            setData({ client, ceremonies, photos });
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading invitation...</div>;
    if (error || !data) return <div className="flex h-screen items-center justify-center">Invitation not found.</div>;

    const { client } = data;

    // Render Template
    switch (client.template_id) {
        case 'elegant':
            return <TemplateElegant data={data} />;
        case 'motion':
            return <TemplateMotion data={data} />;
        case 'romantic':
            return <TemplateRomantic data={data} />;
        case 'simple':
        default:
            return <TemplateSimple data={data} />;
    }
}
