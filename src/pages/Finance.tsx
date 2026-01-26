import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, Wallet, TrendingUp, AlertCircle, PiggyBank } from 'lucide-react';

const START_MONTH = 1; // Février (0-indexed)
const START_YEAR = 2026;

// --- Mock Data ---
const ACTIVE_LOANS = [
    { member: 'Daniel', amount: 500, deadline: '01 Mars 2026' },
    { member: 'Boris', amount: 300, deadline: '01 Avr. 2026' },
    { member: 'Silvère', amount: 1000, deadline: '01 Mai 2026' },
];

const MEMBER_SAVINGS = [
    { member: 'Paola', amount: 2500 },
    { member: 'Silvère', amount: 2300 },
    { member: 'Adam', amount: 2100 },
    { member: 'Daniel', amount: 2000 },
    { member: 'Marcell', amount: 1950 },
    { member: 'Hulerich', amount: 1800 },
    { member: 'Yvan', amount: 1700 },
    { member: 'Boris', amount: 1500 },
];

// Génération de données pour la courbe (Période Tontine = 24 mois)
const SAVINGS_EVOLUTION = Array.from({ length: 24 }, (_, i) => {
    const date = new Date(START_YEAR, START_MONTH + i, 1);
    const monthStr = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    // Simulation simple d'une croissance
    const total = 12000 + (i * 850) + (Math.random() * 200);
    return { name: monthStr, montant: Math.round(total) };
});

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
                    <Wallet className="mr-2" size={18} /> Cotisations & Épargne
                </button>
                <button onClick={() => setActiveTab('prets')} className={`btn ${activeTab === 'prets' ? 'btn-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    <Calculator className="mr-2" size={18} /> Simulateur Prêts
                </button>
                <button onClick={() => setActiveTab('sanctions')} className={`btn ${activeTab === 'sanctions' ? 'btn-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    <AlertCircle className="mr-2" size={18} /> Sanctions
                </button>
            </div>

            {activeTab === 'cotisations' && (
                <div className="space-y-8">
                    {/* Règles Tontine */}
                    <div className="glass-card max-w-3xl">
                        <h2 className="text-lg font-semibold mb-4 text-white">Règles Tontine</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col justify-between p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-200">
                                <span className="text-sm opacity-80">Avant réception</span>
                                <span className="font-bold text-2xl">313 €</span>
                            </div>
                            <div className="flex flex-col justify-between p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200">
                                <span className="text-sm opacity-80">Après réception</span>
                                <span className="font-bold text-2xl">331 €</span>
                            </div>
                            <div className="flex flex-col justify-between p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-200">
                                <span className="text-sm opacity-80">Fond de soutien</span>
                                <span className="font-bold text-xl">20 € / mois</span>
                            </div>
                        </div>
                    </div>

                    {/* Section Dashboard Financier déplacée */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Liste des Prêts en cours */}
                        <div className="glass-card lg:col-span-1">
                            <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                                <AlertCircle className="text-yellow-400" size={20} />
                                Prêts en cours
                            </h2>
                            <div className="space-y-3">
                                {ACTIVE_LOANS.map((loan, idx) => (
                                    <div key={idx} className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-slate-200">{loan.member}</p>
                                            <p className="text-xs text-slate-400">Pour le {loan.deadline}</p>
                                        </div>
                                        <span className="font-mono font-bold text-yellow-300 bg-yellow-400/10 px-2 py-1 rounded text-sm">
                                            {loan.amount} €
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Épargne par membre */}
                        <div className="glass-card lg:col-span-1">
                            <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                                <PiggyBank className="text-blue-400" size={20} />
                                Épargne Membres
                            </h2>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {MEMBER_SAVINGS.map((saver, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                        <span className="text-slate-300 text-sm">{saver.member}</span>
                                        <span className="font-mono font-medium text-blue-300">
                                            {saver.amount.toLocaleString('fr-FR')} €
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Évolution Épargne Groupe (Graphique) - Pleine largeur en bas */}
                    <div className="glass-card w-full">
                        <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                            <TrendingUp className="text-green-400" size={20} />
                            Évolution Épargne Groupe
                        </h2>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={SAVINGS_EVOLUTION} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={1}
                                    />
                                    <YAxis
                                        hide={false}
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value / 1000}k`}
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e1b4b', borderColor: '#4c1d95', color: '#fff' }}
                                        itemStyle={{ color: '#c4b5fd' }}
                                        formatter={(value: any) => [`${value} €`, 'Épargne']}
                                        labelStyle={{ color: '#94a3b8' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="montant"
                                        stroke="#8b5cf6"
                                        strokeWidth={4}
                                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 8, fill: '#fff' }}
                                    />
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
