import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Sites from './pages/Sites';
import Hacks from './pages/Hacks';
import Books from './pages/Books';
import Community from './pages/Community';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSites from './pages/admin/AdminSites';
import AdminHacks from './pages/admin/AdminHacks';
import AdminBooks from './pages/admin/AdminBooks';
import AdminCommunity from './pages/admin/AdminCommunity';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ommaviy sahifalar */}
          <Route path="/" element={<Home />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/hacks" element={<Hacks />} />
          <Route path="/books" element={<Books />} />
          <Route path="/community" element={<Community />} />

          {/* Admin sahifalari */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/sites" element={<ProtectedRoute><AdminSites /></ProtectedRoute>} />
          <Route path="/admin/hacks" element={<ProtectedRoute><AdminHacks /></ProtectedRoute>} />
          <Route path="/admin/books" element={<ProtectedRoute><AdminBooks /></ProtectedRoute>} />
          <Route path="/admin/community" element={<ProtectedRoute><AdminCommunity /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
