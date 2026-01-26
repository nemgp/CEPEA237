import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Login() {
    const [name, setName] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            login(name);
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md border border-white/20 shadow-[0_0_50px_rgba(124,58,237,0.1)]">
                <div className="text-center mb-8">
                    <img src={logo} alt="CEPEA237" className="w-24 h-24 mx-auto mb-4 object-contain bg-white/5 rounded-full p-2 border border-white/10" />
                    <h1 className="text-2xl font-bold text-white">Bienvenue</h1>
                    <p className="text-slate-400">Portail CEPEA237</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Votre Nom</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-slate-600"
                            placeholder="Ex: Marcell"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full shadow-lg shadow-purple-900/50">
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
}
