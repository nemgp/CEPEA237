import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, Wallet, TrendingUp, AlertCircle, PiggyBank, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/googleSheetsAPI';
import type { Loan, Saving } from '../services/googleSheetsAPI';

const START_MONTH = 1; // Février (0-indexed)
const START_YEAR = 2026;

// Date formatting utilities
function formatDateDisplay(dateStr: string): string {
    if (!dateStr) return '';

    // Extract only the date part if there's a timestamp
    // Handles formats like "2026-05-02T22:00:00.000Z" or "2026-05-02"
    const datePart = dateStr.split('T')[0];

    // If it's in ISO format (YYYY-MM-DD), convert to readable format
    if (datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = datePart.split('-');
        const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
    }

    // Otherwise return as is
    return dateStr;
}

export default function Finance() {
    const { user, canEdit } = useAuth();
    const [activeTab, setActiveTab] = useState<'cotisations' | 'prets' | 'sanctions'>('cotisations');

    // Data states
    const [loans, setLoans] = useState<Loan[]>([]);
    const [savings, setSavings] = useState<Saving[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal states
    const [showLoanModal, setShowLoanModal] = useState(false);
    const [showSavingModal, setShowSavingModal] = useState(false);
    const [showMemberSavingsModal, setShowMemberSavingsModal] = useState(false);
    const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
    const [editingSaving, setEditingSaving] = useState<Saving | null>(null);
    const [selectedMember, setSelectedMember] = useState<string>('');
    const [reopenMemberModal, setReopenMemberModal] = useState(false);

    // Calculateur Prêts
    const [loanAmount, setLoanAmount] = useState(100);
    const [loanType, setLoanType] = useState('type1');

    // Calculateur Sanctions
    const [lateMeetings, setLateMeetings] = useState(0);
    const [absences, setAbsences] = useState(0);
    const [projectDelays, setProjectDelays] = useState(0);

    const totalSanctions = (lateMeetings * 2) + (absences * 10) + (projectDelays * 15);

    const calculateInterest = () => {
        if (loanType === 'type1') {
            return (loanAmount * 0.02 * 3).toFixed(2);
        } else {
            return (loanAmount * 0.03 * 6).toFixed(2);
        }
    };

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (!user) return;

        console.log('[Finance] Loading data for user:', user.username);
        setIsLoading(true);
        setError('');
        try {
            const [loansRes, savingsRes] = await Promise.all([
                api.getLoans(), // No argument needed
                api.getSavings(user.username)
            ]);

            console.log('[Finance] Loans response:', loansRes);
            console.log('[Finance] Savings response:', savingsRes);

            if (loansRes.success && loansRes.data) {
                setLoans(loansRes.data);
            }
            if (savingsRes.success && savingsRes.data) {
                console.log('[Finance] Setting savings data:', savingsRes.data);
                setSavings(savingsRes.data);
            }
        } catch (err: any) {
            console.error('[Finance] Error loading data:', err);
            setError(err.message || 'Erreur lors du chargement des données');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLoan = async (id: string) => {
        if (!user || !confirm('Êtes-vous sûr de vouloir supprimer ce prêt ?')) return;

        try {
            const res = await api.deleteLoan(user.username, id);
            if (res.success) {
                loadData();
            }
        } catch (err: any) {
            alert(err.message || 'Erreur lors de la suppression');
        }
    };

    const handleDeleteSaving = async (id: string) => {
        if (!user || !confirm('Êtes-vous sûr de vouloir supprimer cette épargne ?')) return;

        try {
            const res = await api.deleteSaving(user.username, id);
            if (res.success) {
                loadData();
            }
        } catch (err: any) {
            alert(err.message || 'Erreur lors de la suppression');
        }
    };

    // Calculate savings evolution from real data
    const calculateSavingsEvolution = () => {
        // Group savings by month and calculate cumulative total
        const monthlyData: Record<string, number> = {};

        savings.forEach(saving => {
            const datePart = saving.date.split('T')[0];
            const date = new Date(datePart);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = 0;
            }

            monthlyData[monthKey] += saving.type === 'depot' ? saving.amount : -saving.amount;
        });

        // Generate array for last 24 months
        const result = [];
        let cumulativeTotal = 0;

        for (let i = 0; i < 24; i++) {
            const date = new Date(START_YEAR, START_MONTH + i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthStr = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });

            // Add this month's transactions to cumulative total
            if (monthlyData[monthKey]) {
                cumulativeTotal += monthlyData[monthKey];
            }

            result.push({
                name: monthStr,
                montant: Math.round(cumulativeTotal)
            });
        }

        return result;
    };

    const SAVINGS_EVOLUTION = calculateSavingsEvolution();

    // Calculate total savings per member
    const memberSavingsMap: Record<string, number> = {};
    savings.forEach(saving => {
        if (!memberSavingsMap[saving.member]) {
            memberSavingsMap[saving.member] = 0;
        }
        memberSavingsMap[saving.member] += saving.type === 'depot' ? saving.amount : -saving.amount;
    });

    // Filter active loans
    const activeLoans = loans.filter(loan => loan.status === 'en_cours');

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white drop-shadow-md">Gestion Financière</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-red-200">{error}</p>
                </div>
            )}

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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Liste des Prêts en cours */}
                        <div className="glass-card lg:col-span-1">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <AlertCircle className="text-yellow-400" size={20} />
                                    Prêts en cours
                                </h2>
                                {canEdit() && (
                                    <button
                                        onClick={() => {
                                            setEditingLoan(null);
                                            setShowLoanModal(true);
                                        }}
                                        className="btn btn-primary btn-sm flex items-center gap-1"
                                    >
                                        <Plus size={16} />
                                        Ajouter
                                    </button>
                                )}
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin text-purple-400" size={32} />
                                </div>
                            ) : activeLoans.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">Aucun prêt en cours</p>
                            ) : (
                                <div className="space-y-3">
                                    {activeLoans.map((loan) => (
                                        <div key={loan.id} className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-200">{loan.member}</p>
                                                <p className="text-xs text-slate-400">Pour le {formatDateDisplay(loan.date)}</p>
                                                {loan.notes && <p className="text-xs text-slate-500 mt-1">{loan.notes}</p>}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-yellow-300 bg-yellow-400/10 px-2 py-1 rounded text-sm">
                                                    {loan.amount} €
                                                </span>
                                                {canEdit() && (
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => {
                                                                setEditingLoan(loan);
                                                                setShowLoanModal(true);
                                                            }}
                                                            className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                                        >
                                                            <Edit2 size={14} className="text-blue-400" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteLoan(loan.id)}
                                                            className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                                        >
                                                            <Trash2 size={14} className="text-red-400" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Épargne par membre */}
                        <div className="glass-card lg:col-span-1">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <PiggyBank className="text-blue-400" size={20} />
                                    Épargne Membres
                                </h2>
                                {canEdit() && (
                                    <button
                                        onClick={() => {
                                            setEditingSaving(null);
                                            setShowSavingModal(true);
                                        }}
                                        className="btn btn-primary btn-sm flex items-center gap-1"
                                    >
                                        <Plus size={16} />
                                        Ajouter
                                    </button>
                                )}
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin text-purple-400" size={32} />
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                    {/* Show all members, even those with 0 savings */}
                                    {['Marcell', 'Paola', 'Daniel', 'Adam', 'Silvère', 'Yvan', 'Hulerich', 'Boris', 'Mairo'].map((memberName) => {
                                        const memberTotal = memberSavingsMap[memberName] || 0;
                                        const memberTransactions = savings.filter(s => s.member === memberName);

                                        return (
                                            <div key={memberName} className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <span className="text-slate-300 text-sm font-medium">{memberName}</span>
                                                    <span className="text-xs text-slate-500">
                                                        ({memberTransactions.length} transaction{memberTransactions.length > 1 ? 's' : ''})
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono font-medium text-blue-300">
                                                        {memberTotal.toLocaleString('fr-FR')} €
                                                    </span>
                                                    {canEdit() && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedMember(memberName);
                                                                setShowMemberSavingsModal(true);
                                                            }}
                                                            className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                                            title="Voir les transactions"
                                                        >
                                                            <Edit2 size={14} className="text-blue-400" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Évolution Épargne Groupe */}
                    <div className="glass-card w-full">
                        <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                            <TrendingUp className="text-green-400" size={20} />
                            Évolution Épargne Groupe
                        </h2>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={SAVINGS_EVOLUTION} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} interval={1} />
                                    <YAxis hide={false} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} domain={['auto', 'auto']} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e1b4b', borderColor: '#4c1d95', color: '#fff' }} itemStyle={{ color: '#c4b5fd' }} formatter={(value: any) => [`${value} €`, 'Épargne']} labelStyle={{ color: '#94a3b8' }} />
                                    <Line type="monotone" dataKey="montant" stroke="#8b5cf6" strokeWidth={4} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }} activeDot={{ r: 8, fill: '#fff' }} />
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

            {/* Loan Modal */}
            {showLoanModal && (
                <LoanModal
                    loan={editingLoan}
                    onClose={() => {
                        setShowLoanModal(false);
                        setEditingLoan(null);
                    }}
                    onSuccess={() => {
                        setShowLoanModal(false);
                        setEditingLoan(null);
                        loadData();
                    }}
                />
            )}

            {/* Saving Modal */}
            {showSavingModal && (
                <SavingModal
                    saving={editingSaving}
                    prefilledMember={reopenMemberModal ? selectedMember : undefined}
                    onClose={() => {
                        setShowSavingModal(false);
                        setEditingSaving(null);
                        setReopenMemberModal(false);
                        if (!reopenMemberModal) {
                            setSelectedMember('');
                        }
                    }}
                    onSuccess={async () => {
                        setShowSavingModal(false);
                        setEditingSaving(null);

                        // Wait a bit for Google Sheets to propagate the data
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        await loadData();

                        console.log('Data loaded, reopenMemberModal:', reopenMemberModal, 'selectedMember:', selectedMember);

                        // Reopen member modal if we were adding/editing from there
                        // We set a flag and let useEffect handle the reopening after state update
                        if (reopenMemberModal && selectedMember) {
                            // Trigger reopen via state update
                            setTimeout(() => {
                                setShowMemberSavingsModal(true);
                                setReopenMemberModal(false);
                            }, 100);
                        } else {
                            setSelectedMember('');
                            setReopenMemberModal(false);
                        }
                    }}
                />
            )}

            {/* Member Savings Detail Modal */}
            {showMemberSavingsModal && (
                <MemberSavingsModal
                    member={selectedMember}
                    savings={savings.filter(s => s.member === selectedMember)}
                    onClose={() => {
                        setShowMemberSavingsModal(false);
                        setSelectedMember('');
                    }}
                    onAddTransaction={() => {
                        // Set to null to indicate new transaction, not update
                        setEditingSaving(null);
                        setReopenMemberModal(true);
                        setShowMemberSavingsModal(false);
                        setShowSavingModal(true);
                    }}
                    onEditTransaction={(saving) => {
                        setReopenMemberModal(true);
                        setShowMemberSavingsModal(false);
                        setEditingSaving(saving);
                        setShowSavingModal(true);
                    }}
                    onDeleteTransaction={handleDeleteSaving}
                    onRefresh={loadData}
                    canEdit={canEdit()}
                />
            )}
        </div>
    );
}

// Loan Modal Component
function LoanModal({ loan, onClose, onSuccess }: { loan: Loan | null; onClose: () => void; onSuccess: () => void }) {
    const { user } = useAuth();
    const MEMBERS = ['Marcell', 'Paola', 'Daniel', 'Adam', 'Silvère', 'Yvan', 'Hulerich', 'Boris', 'Mairo'];

    // Convert date to ISO format for the date input
    const getISODate = (dateStr: string) => {
        if (!dateStr) return '';
        // If already ISO format, return as is
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
        // If it's an ISO timestamp, extract the date part
        if (dateStr.includes('T')) {
            return dateStr.split('T')[0];
        }
        // Try to parse as a date object
        try {
            const parsed = new Date(dateStr);
            if (!isNaN(parsed.getTime())) {
                return parsed.toISOString().split('T')[0];
            }
        } catch (e) {
            // Ignore parsing errors
        }
        return '';
    };

    const [member, setMember] = useState(loan?.member || '');
    const [amount, setAmount] = useState(loan?.amount || 0);
    const [date, setDate] = useState(getISODate(loan?.date || ''));
    const [status, setStatus] = useState<'en_cours' | 'rembourse'>(loan?.status || 'en_cours');
    const [notes, setNotes] = useState(loan?.notes || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        setError('');

        try {
            if (loan) {
                // Update
                await api.updateLoan(user.username, loan.id, { member, amount, date, status, notes });
            } else {
                // Create
                await api.createLoan(user.username, { member, amount, date, status, notes });
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="glass-card w-full max-w-lg my-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">
                        {loan ? 'Modifier le prêt' : 'Nouveau prêt'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Membre + Montant */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Membre</label>
                            <select
                                value={member}
                                onChange={(e) => setMember(e.target.value)}
                                className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            >
                                <option value="">Sélectionner</option>
                                {MEMBERS.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Montant (€)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Row 2: Date + Statut */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Date d'échéance</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Statut</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'en_cours' | 'rembourse')}
                                className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="en_cours">En cours</option>
                                <option value="rembourse">Remboursé</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 3: Notes (full width) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Notes (optionnel)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn bg-white/5 text-white hover:bg-white/10"
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Enregistrement...
                                </>
                            ) : (
                                'Enregistrer'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Saving Modal Component
function SavingModal({ saving, prefilledMember, onClose, onSuccess }: {
    saving: Saving | null;
    prefilledMember?: string;
    onClose: () => void;
    onSuccess: () => void
}) {
    const { user } = useAuth();
    const MEMBERS = ['Marcell', 'Paola', 'Daniel', 'Adam', 'Silvère', 'Yvan', 'Hulerich', 'Boris', 'Mairo'];

    // Convert date to ISO format for the date input
    const getISODate = (dateStr: string) => {
        if (!dateStr) return '';
        // If already ISO format, return as is
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
        // If it's an ISO timestamp, extract the date part
        if (dateStr.includes('T')) {
            return dateStr.split('T')[0];
        }
        // Try to parse as a date object
        try {
            const parsed = new Date(dateStr);
            if (!isNaN(parsed.getTime())) {
                return parsed.toISOString().split('T')[0];
            }
        } catch (e) {
            // Ignore parsing errors
        }
        return '';
    };

    const [member, setMember] = useState(saving?.member || prefilledMember || '');
    const [amount, setAmount] = useState(saving?.amount || 0);
    const [date, setDate] = useState(getISODate(saving?.date || ''));
    const [type, setType] = useState<'depot' | 'retrait'>(saving?.type || 'depot');
    const [notes, setNotes] = useState(saving?.notes || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        console.log('[SavingModal] Submitting:', { member, amount, date, type, notes });
        setIsSubmitting(true);
        setError('');

        try {
            let result;
            if (saving) {
                // Update
                console.log('[SavingModal] Updating saving:', saving.id);
                result = await api.updateSaving(user.username, saving.id, { member, amount, date, type, notes });
            } else {
                // Create
                console.log('[SavingModal] Creating new saving');
                result = await api.createSaving(user.username, { member, amount, date, type, notes });
            }
            console.log('[SavingModal] API result:', result);

            if (result.success) {
                onSuccess();
            } else {
                setError(result.error || 'Erreur lors de l\'enregistrement');
            }
        } catch (err: any) {
            console.error('[SavingModal] Error:', err);
            setError(err.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="glass-card w-full max-w-lg my-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">
                        {saving ? 'Modifier l\'épargne' : 'Nouvelle épargne'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Membre + Montant */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Membre</label>
                            <select
                                value={member}
                                onChange={(e) => setMember(e.target.value)}
                                className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            >
                                <option value="">Sélectionner</option>
                                {MEMBERS.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Montant (€)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Row 2: Date + Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as 'depot' | 'retrait')}
                                className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="depot">Dépôt</option>
                                <option value="retrait">Retrait</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 3: Notes (full width) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Notes (optionnel)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn bg-white/5 text-white hover:bg-white/10"
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Enregistrement...
                                </>
                            ) : (
                                'Enregistrer'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Member Savings Detail Modal Component
function MemberSavingsModal({
    member,
    savings,
    onClose,
    onAddTransaction,
    onEditTransaction,
    onDeleteTransaction,
    onRefresh,
    canEdit
}: {
    member: string;
    savings: Saving[];
    onClose: () => void;
    onAddTransaction: () => void;
    onEditTransaction: (saving: Saving) => void;
    onDeleteTransaction: (id: string) => void;
    onRefresh: () => void;
    canEdit: boolean;
}) {
    const totalSavings = savings.reduce((sum, s) => {
        return sum + (s.type === 'depot' ? s.amount : -s.amount);
    }, 0);

    // Sort by date (most recent first)
    const sortedSavings = [...savings].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
    });

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
            await onDeleteTransaction(id);
            onRefresh();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="glass-card w-full max-w-3xl my-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            Épargne de {member}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                            Total: <span className="font-mono font-bold text-blue-300">{totalSavings.toLocaleString('fr-FR')} €</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {canEdit && (
                    <button
                        onClick={onAddTransaction}
                        className="btn btn-primary btn-sm flex items-center gap-1 mb-4"
                    >
                        <Plus size={16} />
                        Ajouter une transaction
                    </button>
                )}

                {sortedSavings.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">Aucune transaction enregistrée</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left text-xs font-medium text-slate-400 pb-2 px-2">Date</th>
                                    <th className="text-left text-xs font-medium text-slate-400 pb-2 px-2">Type</th>
                                    <th className="text-right text-xs font-medium text-slate-400 pb-2 px-2">Montant</th>
                                    <th className="text-left text-xs font-medium text-slate-400 pb-2 px-2">Notes</th>
                                    {canEdit && <th className="text-center text-xs font-medium text-slate-400 pb-2 px-2">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedSavings.map((saving) => (
                                    <tr key={saving.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-2 text-sm text-slate-300">
                                            {formatDateDisplay(saving.date)}
                                        </td>
                                        <td className="py-3 px-2">
                                            <span className={`text-xs px-2 py-1 rounded ${saving.type === 'depot'
                                                ? 'bg-green-500/10 text-green-300'
                                                : 'bg-red-500/10 text-red-300'
                                                }`}>
                                                {saving.type === 'depot' ? 'Dépôt' : 'Retrait'}
                                            </span>
                                        </td>
                                        <td className={`py-3 px-2 text-right font-mono font-medium ${saving.type === 'depot' ? 'text-green-300' : 'text-red-300'
                                            }`}>
                                            {saving.type === 'depot' ? '+' : '-'}{saving.amount.toLocaleString('fr-FR')} €
                                        </td>
                                        <td className="py-3 px-2 text-sm text-slate-400 max-w-xs truncate">
                                            {saving.notes || '-'}
                                        </td>
                                        {canEdit && (
                                            <td className="py-3 px-2">
                                                <div className="flex gap-1 justify-center">
                                                    <button
                                                        onClick={() => onEditTransaction(saving)}
                                                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Edit2 size={14} className="text-blue-400" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(saving.id)}
                                                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={14} className="text-red-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="btn bg-white/5 text-white hover:bg-white/10"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}
