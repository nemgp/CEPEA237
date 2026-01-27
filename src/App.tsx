import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Organization from './pages/Organization';
import Finance from './pages/Finance';
import Social from './pages/Social';
import Documents from './pages/Documents';
import AdminPasswordReset from './pages/AdminPasswordReset';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/organisation" element={<PrivateRoute><Organization /></PrivateRoute>} />
          <Route path="/finance" element={<PrivateRoute><Finance /></PrivateRoute>} />
          <Route path="/social" element={<PrivateRoute><Social /></PrivateRoute>} />
          <Route path="/documents" element={<PrivateRoute><Documents /></PrivateRoute>} />
          <Route path="/admin/reset-password" element={<PrivateRoute><AdminPasswordReset /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
