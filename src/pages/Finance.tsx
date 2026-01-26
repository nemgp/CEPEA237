import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, Wallet, TrendingUp, AlertCircle } from 'lucide-react';

const dataEpargne = [
    { name: 'Jan', amount: 1200 },
    { name: 'Fév', amount: 1550 },
    { name: 'Mar', amount: 2100 },
    { name: 'Avr', amount: 2450 },
    { name: 'Mai', amount: 3100 },
    { name: 'Juin', amount: 3800 },
];

export default function Finance() {
    const [activeTab, setActiveTab] = useState<'cotisations' | 'prets' | 'sanctions'>('cotisations');

    // Calculateur Prêts
    const [loanAmount, setLoanAmount] = useState(100);
    const [loanType, setLoanType] = useState('type1');

    const calculateInterest = () => {
        if (loanType === 'type1') {
            // 2% sur 3 mois (intérêt dégressif) - Simplification pour l'affichage
            return (loanAmount * 0.02 * 3).toFixed(2);
        } else {
            // 3% global
            return (loanAmount * 0.03).toFixed(2);
        }
    };

    // Calculateur Sanctions
    const [lateMeetings, setLateMeetings] = useState(0);
    const [absences, setAbsences] = useState(0);
    const [projectDelays, setProjectDelays] = useState(0);

    const totalSanctions = (lateMeetings * 2) + (absences * 10) + (projectDelays * 15);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white drop-shadow-md">Gestion Financière</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                <button onClick={() => setActiveTab('cotisations')} className={`btn ${activeTab === 'cotisations' ? 'btn-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    <Wallet className="mr-2" size={18} /> Cotisations
                </button>
                <button onClick={() => setActiveTab('prets')} className={`btn ${activeTab === 'prets' ? 'btn-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    <Calculator className="mr-2" size={18} /> Simulateur Prêts
                </button>
                <button onClick={() => setActiveTab('sanctions')} className={`btn ${activeTab === 'sanctions' ? 'btn-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    <AlertCircle className="mr-2" size={18} /> Sanctions
                </button>
            </div>

            {activeTab === 'cotisations' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card">
                        <h2 className="text-lg font-semibold mb-4 text-white">Règles Tontine</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-200">
                                <span>Avant réception</span>
                                <span className="font-bold">313 €</span>
                            </div>
                            <div className="flex justify-between p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200">
                                <span>Après réception</span>
                                <span className="font-bold">331 €</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                            <TrendingUp size={20} /> Évolution Épargne Groupe
                        </h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dataEpargne}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="#cbd5e1" />
                                    <YAxis stroke="#cbd5e1" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'prets' && (
                <div className="glass-card max-w-lg mx-auto">
                    <h2 className="text-lg font-semibold mb-4 text-white">Calculateur d'Intérêts</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">Montant du prêt (€)</label>
                            <input type="number" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">Type de prêt</label>
                            <select value={loanType} onChange={e => setLoanType(e.target.value)} className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500">
                                <option value="type1">Type 1 : 2% / mois (3 mois dégressif)</option>
                                <option value="type2">Type 2 : 3% Global (Intérêt simple)</option>
                            </select>
                        </div>
                        <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl text-center">
                            <p className="text-sm text-purple-200">Intérêts Estimés</p>
                            <p className="text-3xl font-bold text-white shadow-purple-500/50 drop-shadow">{calculateInterest()} €</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'sanctions' && (
                <div className="glass-card max-w-lg mx-auto">
                    <h2 className="text-lg font-semibold mb-4 text-white">Calculateur de Sanctions</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-slate-300">
                            <label>Retard Réunion (2€)</label>
                            <input type="number" min="0" value={lateMeetings} onChange={e => setLateMeetings(Number(e.target.value))} className="w-20 p-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-center" />
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                            <label>Absence Injustifiée (10€)</label>
                            <input type="number" min="0" value={absences} onChange={e => setAbsences(Number(e.target.value))} className="w-20 p-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-center" />
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                            <label>Retard Projet Immo (15€)</label>
                            <input type="number" min="0" value={projectDelays} onChange={e => setProjectDelays(Number(e.target.value))} className="w-20 p-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-center" />
                        </div>
                        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                            <span className="font-bold text-white">Total à payer</span>
                            <span className="text-xl font-bold text-red-400 drop-shadow-md">{totalSanctions} €</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
