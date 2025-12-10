import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Client {
    id: string;
    couple_name: string;
    slug: string;
    template_id: string;
    created_at: string;
}

export default function AdminDashboard() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const { data } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setClients(data);
        setLoading(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
                <Link
                    to="/admin/clients/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Client</span>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Couple Name</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Template</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
                        ) : clients.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No clients found. Create one!</td></tr>
                        ) : (
                            clients.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{client.couple_name}</td>
                                    <td className="px-6 py-4 text-blue-600">
                                        <a href={`/invite/${client.slug}`} target="_blank" rel="noreferrer" className="flex items-center hover:underline">
                                            {client.slug} <LinkIcon className="w-3 h-3 ml-1" />
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">{client.template_id || 'None'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link to={`/admin/clients/${client.id}`} className="text-blue-600 text-sm font-medium hover:text-blue-800">
                                            Manage
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
