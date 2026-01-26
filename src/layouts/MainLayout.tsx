import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, HeartHandshake, FileText, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import logo from '../assets/logo.png';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/organisation', label: 'Organisation', icon: Users },
        { path: '/finance', label: 'Finances', icon: Wallet },
        { path: '/social', label: 'Secours', icon: HeartHandshake },
        { path: '/documents', label: 'Documents', icon: FileText },
    ];

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden glass-panel p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 h-16">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-primary">CEPEA237</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </header>

            {/* Sidebar (Desktop) / Mobile Menu */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 glass-panel text-white transform transition-transform duration-300 ease-in-out font-medium
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen flex flex-col
      `}>
                <div className="p-6 flex items-center gap-3 border-b border-white/10">
                    <img src={logo} alt="Logo" className="w-10 h-10 bg-white/10 rounded-full p-1 border border-white/20" />
                    <div>
                        <h1 className="text-xl font-bold text-white">CEPEA237</h1>
                        <p className="text-[10px] text-secondary whitespace-nowrap">Entraide - Partage - Évolution</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-14 md:mt-0">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive ? 'bg-purple-600/80 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'hover:bg-white/5 text-slate-300'}
              `}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold border border-white/20">
                            {user?.name?.charAt(0) || 'M'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate text-white">{user?.name || 'Membre'}</p>
                            <p className="text-xs text-secondary">Cycle 6</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                        <LogOut size={16} />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 overflow-auto">
                <div className="container mx-auto max-w-5xl">
                    {children}
                </div>
            </main>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
