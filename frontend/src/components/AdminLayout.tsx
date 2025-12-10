import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, Users, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/admin/login');
            }
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
        <Link
            to={to}
            className={`flex items-center space-x-2 px-4 py-3 rounded-md transition ${location.pathname === to
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
        </Link>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <img src="/inviteleaf-logo.png" alt="InviteLeaf" className="h-8" />
                    <h2 className="text-xl font-bold text-gray-800">InviteLeaf</h2>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavItem to="/admin/dashboard" icon={Users} label="Clients" />
                    <NavItem to="/admin/settings" icon={Settings} label="Settings" />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-red-600 hover:bg-red-50 p-3 rounded-md w-full transition"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
