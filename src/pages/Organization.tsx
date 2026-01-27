import { useState } from 'react';
import { History, Users } from 'lucide-react';
import lion from '../assets/avatars/lion.png';
import zebra from '../assets/avatars/zebra.png';
import elephant from '../assets/avatars/elephant.png';
import giraffe from '../assets/avatars/giraffe.png';
import hippo from '../assets/avatars/hippo.png';
import rhino from '../assets/avatars/rhino.png';
import leopard from '../assets/avatars/leopard.png';
import monkey from '../assets/avatars/monkey.png';

const AVATAR_MAP: Record<string, string> = {
    'Marcell': lion,
    'Paola': zebra,
    'Adam': elephant,
    'Daniel': giraffe,
    'Silvère': hippo,
    'Hulerich': rhino,
    'Yvan': leopard,
    'Boris': monkey,
    'Mairo': lion,
};

// Bureau actuel (Cycle 6)
const CURRENT_BUREAU = [
    {
        role: 'Président',
        name: 'Marcell'
    },
    {
        role: 'Secrétaire Général',
        name: 'Paola'
    },
    {
        role: 'Commissaire aux Comptes',
        name: 'Adam'
    },
    {
        role: 'Trésorier',
        name: 'Daniel'
    },
    {
        role: '1er Censeur',
        name: 'Yvan'
    },
    {
        role: '2ème Censeur',
        name: 'Boris'
    },
    {
        role: 'Membre',
        name: 'Hulerich'
    },
    {
        role: 'Membre',
        name: 'Mairo'
    },
    {
        role: 'Membre',
        name: 'Silvère'
    },
];

// Historique des bureaux (Cycle 5 uniquement)
const BUREAU_HISTORY = [
    {
        cycle: 'Cycle 5 (2024-2025)',
        members: [
            { role: 'Président', name: 'Daniel' },
            { role: 'Secrétaire Général', name: 'Marcell' },
            { role: 'Trésorier', name: 'Adam' },
            { role: 'Commissaire aux Comptes', name: 'Paola' },
            { role: '1er Censeur', name: 'Boris' },
            { role: '2ème Censeur', name: 'Yvan' },
        ]
    }
];

export default function Organization() {
    const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white">Organisation - Cycle 6</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveTab('current')}
                    className={`btn ${activeTab === 'current' ? 'btn-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    <Users className="mr-2" size={18} /> Bureau Actuel
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`btn ${activeTab === 'history' ? 'btn-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    <History className="mr-2" size={18} /> Historique
                </button>
            </div>

            {/* Bureau Actuel */}
            {activeTab === 'current' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CURRENT_BUREAU.map((member) => (
                        <div key={member.role} className="glass-card hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-900 border-2 border-white/10 flex-shrink-0">
                                    <img
                                        src={AVATAR_MAP[member.name]}
                                        alt={member.name}
                                        className={`w-full h-full object-cover ${member.name === 'Yvan' ? 'scale-125' : ''}`}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-white">{member.name}</h3>
                                    <p className="text-sm text-cyan-300 mb-2">{member.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Historique des Bureaux */}
            {activeTab === 'history' && (
                <div className="space-y-6">
                    {BUREAU_HISTORY.map((bureau, index) => (
                        <div key={index} className="glass-card">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <History className="text-purple-400" size={20} />
                                {bureau.cycle}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {bureau.members.map((member, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-900 border border-white/10">
                                            <img
                                                src={AVATAR_MAP[member.name]}
                                                alt={member.name}
                                                className={`w-full h-full object-cover ${member.name === 'Yvan' ? 'scale-125' : ''}`}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm">{member.name}</p>
                                            <p className="text-xs text-slate-400">{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
