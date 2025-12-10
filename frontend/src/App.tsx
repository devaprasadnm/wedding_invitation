import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import ClientForm from './pages/ClientForm';
import AdminSettings from './pages/AdminSettings';
import PublicInvite from './pages/PublicInvite';

function App() {
    return (
        <Router>
            <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="clients/new" element={<ClientForm />} />
                    <Route path="clients/:id" element={<ClientForm />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route index element={<Navigate to="dashboard" replace />} />
                </Route>

                {/* Public Routes */}
                <Route path="/invite/:slug" element={<PublicInvite />} />

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/admin/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
