import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
            // Navigation will be handled by App.tsx based on mustChangePassword
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Identifiants incorrects. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md border border-white/20 shadow-[0_0_50px_rgba(124,58,237,0.1)]">
                <div className="text-center mb-8">
                    <img src={logo} alt="CEPEA237" className="w-24 h-24 mx-auto mb-4 object-contain bg-white/5 rounded-full p-2 border border-white/10" />
                    <h1 className="text-2xl font-bold text-white">Bienvenue</h1>
                    <p className="text-slate-400">Portail CEPEA237</p>
                    <p className="text-xs text-slate-500 mt-1">Entraide - Partage - Évolution</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                        <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-red-200">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-slate-600"
                            placeholder="Ex: Marcell"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-slate-600"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Connexion...
                            </>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
