import { useState } from 'react';
import { Heart } from 'lucide-react';

const ASSIETTE = 1000;

const HELP_TYPES = [
    { id: 'deces', label: 'Décès Membre', percent: 1, icon: '⚰️' },
    { id: 'naissance', label: 'Naissance', percent: 0.5, icon: '👶' },
    { id: 'mariage', label: 'Mariage', percent: 0.5, icon: '💍' },
    { id: 'hospitalisation', label: 'Hospitalisation (>3j)', percent: 0.25, icon: '🏥' },
];

export default function Social() {
    const [selectedType, setSelectedType] = useState(HELP_TYPES[0]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white text-center md:text-left drop-shadow-md">Secours & Assistance</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-slate-200">Simulateur d'Aides</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {HELP_TYPES.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type)}
                                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer
                            ${selectedType.id === type.id ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'}
                        `}
                            >
                                <span className="text-2xl filter drop-shadow">{type.icon}</span>
                                <div className="flex-1">
                                    <p className="font-semibold">{type.label}</p>
                                    <p className="text-sm opacity-70">{type.percent * 100}% de l'assiette</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass-card h-fit sticky top-4 border-t-4 border-t-cyan-500">
                    <h3 className="text-cyan-400 uppercase text-xs tracking-wider font-bold mb-2">Montant de l'aide estimé</h3>
                    <div className="flex items-end gap-2 mb-6">
                        <span className="text-5xl font-bold text-white drop-shadow-lg">{(ASSIETTE * selectedType.percent)} €</span>
                        <span className="text-slate-400 mb-1">/ événement</span>
                    </div>

                    <div className="p-4 bg-slate-900/50 rounded-xl text-sm mb-6 border border-white/5 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Base de calcul (Assiette)</span>
                            <span className="text-white font-mono">{ASSIETTE} €</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Taux appliqué</span>
                            <span className="text-cyan-300 font-bold">{selectedType.percent * 100} %</span>
                        </div>
                    </div>

                    <button className="btn btn-secondary w-full gap-2 font-bold">
                        <Heart size={18} className="text-red-500 fill-red-500" />
                        Demander cette aide
                    </button>
                </div>
            </div>
        </div>
    );
}
