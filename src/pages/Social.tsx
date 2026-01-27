import { useState, useEffect } from 'react';
import { Heart, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/googleSheetsAPI';

const ASSIETTE = 1500; // Base de cotisation

const HELP_TYPES = [
    { id: 'naissance', label: 'Naissance', percent: 0.5, icon: '👶' },
    { id: 'mariage', label: 'Mariage', percent: 1.0, icon: '💍' },
    { id: 'hospitalisation', label: 'Hospitalisation (>3j)', percent: 0.25, icon: '🏥' },
    { id: 'deces', label: 'Perte grave', percent: 1, icon: '⚰️' },
];

interface Support {
    id: string;
    member: string;
    type: 'naissance' | 'mariage' | 'hospitalisation' | 'deces';
    amount: number;
    date: string;
    notes: string;
}

export default function Social() {
    const { user, canEdit } = useAuth();
    const [supports, setSupports] = useState<Support[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSupport, setEditingSupport] = useState<Support | null>(null);

    useEffect(() => {
        loadSupports();
    }, []);

    const loadSupports = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const response = await api.getSupports(user.username);
            if (response.success && response.data) {
                setSupports(response.data);
            }
        } catch (error) {
            console.error('Error loading supports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!user) return;
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce soutien ?')) {
            try {
                await api.deleteSupport(user.username, id);
                loadSupports();
            } catch (error) {
                console.error('Error deleting support:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const getTypeInfo = (typeId: string) => {
        return HELP_TYPES.find(t => t.id === typeId) || HELP_TYPES[0];
    };

    // Format date display
    const formatDate = (dateStr: string): string => {
        if (!dateStr) return '';
        const datePart = dateStr.split('T')[0];
        if (datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = datePart.split('-');
            const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
            return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
        }
        return dateStr;
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white text-center md:text-left drop-shadow-md">Secours & Assistance</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Info Card - Assiette */}
                <div className="glass-card border-l-4 border-l-purple-500">
                    <h3 className="text-purple-400 uppercase text-xs tracking-wider font-bold mb-2">Assiette de Cotisation</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white drop-shadow-lg">{ASSIETTE} €</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Base de calcul pour tous les soutiens</p>
                </div>

                {/* Types d'aides */}
                {HELP_TYPES.map((type) => (
                    <div key={type.id} className="glass-card">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">{type.icon}</span>
                            <div className="flex-1">
                                <h3 className="font-semibold text-white">{type.label}</h3>
                                <p className="text-sm text-slate-400">{type.percent * 100}% de l'assiette</p>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/10">
                            <span className="text-2xl font-bold text-cyan-300">{ASSIETTE * type.percent} €</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Liste des soutiens reçus */}
            <div className="glass-card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Heart className="text-red-400" size={24} />
                        Historique des Soutiens Reçus
                    </h2>
                    {canEdit() && (
                        <button
                            onClick={() => {
                                setEditingSupport(null);
                                setShowModal(true);
                            }}
                            className="btn btn-primary btn-sm flex items-center gap-1"
                        >
                            <Plus size={16} />
                            Ajouter
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-purple-400" size={32} />
                    </div>
                ) : supports.length === 0 ? (
                    <p className="text-slate-400 text-center py-12">Aucun soutien enregistré</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left text-xs font-medium text-slate-400 pb-3 px-3">Membre</th>
                                    <th className="text-left text-xs font-medium text-slate-400 pb-3 px-3">Type</th>
                                    <th className="text-left text-xs font-medium text-slate-400 pb-3 px-3">Date</th>
                                    <th className="text-right text-xs font-medium text-slate-400 pb-3 px-3">Montant</th>
                                    <th className="text-left text-xs font-medium text-slate-400 pb-3 px-3">Notes</th>
                                    {canEdit() && <th className="text-center text-xs font-medium text-slate-400 pb-3 px-3">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {supports.map((support) => {
                                    const typeInfo = getTypeInfo(support.type);
                                    return (
                                        <tr key={support.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-3 text-sm font-medium text-slate-200">{support.member}</td>
                                            <td className="py-4 px-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{typeInfo.icon}</span>
                                                    <span className="text-sm text-slate-300">{typeInfo.label}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-3 text-sm text-slate-400">{formatDate(support.date)}</td>
                                            <td className="py-4 px-3 text-right">
                                                <span className="font-mono font-bold text-cyan-300">{support.amount.toLocaleString('fr-FR')} €</span>
                                            </td>
                                            <td className="py-4 px-3 text-sm text-slate-400 max-w-xs truncate">{support.notes || '-'}</td>
                                            {canEdit() && (
                                                <td className="py-4 px-3">
                                                    <div className="flex gap-1 justify-center">
                                                        <button
                                                            onClick={() => {
                                                                setEditingSupport(support);
                                                                setShowModal(true);
                                                            }}
                                                            className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit2 size={14} className="text-blue-400" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(support.id)}
                                                            className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={14} className="text-red-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Support Modal */}
            {showModal && (
                <SupportModal
                    support={editingSupport}
                    onClose={() => {
                        setShowModal(false);
                        setEditingSupport(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setEditingSupport(null);
                        loadSupports();
                    }}
                />
            )}
        </div>
    );
}

// Support Modal Component
function SupportModal({ support, onClose, onSuccess }: { support: Support | null; onClose: () => void; onSuccess: () => void }) {
    const { user } = useAuth();
    const MEMBERS = ['Marcell', 'Paola', 'Daniel', 'Adam', 'Silvère', 'Yvan', 'Hulerich', 'Boris', 'Mairo'];

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

    const [member, setMember] = useState(support?.member || '');
    const [type, setType] = useState<'naissance' | 'mariage' | 'hospitalisation' | 'deces'>(support?.type || 'naissance');
    const [amount, setAmount] = useState(support?.amount || 0);
    const [date, setDate] = useState(getISODate(support?.date || ''));
    const [notes, setNotes] = useState(support?.notes || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Auto-calculate amount when type changes
    useEffect(() => {
        if (!support) {
            const selectedType = HELP_TYPES.find(t => t.id === type);
            if (selectedType) {
                setAmount(ASSIETTE * selectedType.percent);
            }
        }
    }, [type, support]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        setError('');

        try {
            if (support) {
                await api.updateSupport(user.username, support.id, { member, type, amount, date, notes });
            } else {
                await api.createSupport(user.username, { member, type, amount, date, notes });
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
                        {support ? 'Modifier le soutien' : 'Nouveau soutien'}
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
                            <label className="block text-sm font-medium text-slate-300 mb-2">Type de soutien</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                                className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            >
                                {HELP_TYPES.map((t) => (
                                    <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

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
