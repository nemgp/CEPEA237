import { useState } from 'react';
import { Mail, History, Image as ImageIcon, Users } from 'lucide-react';
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

// Historique des bureaux (Cycles précédents)
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
    },
    {
        cycle: 'Cycle 4 (2023-2024)',
        members: [
            { role: 'Président', name: 'Adam' },
            { role: 'Secrétaire Général', name: 'Daniel' },
            { role: 'Trésorier', name: 'Paola' },
            { role: 'Commissaire aux Comptes', name: 'Marcell' },
            { role: '1er Censeur', name: 'Silvère' },
            { role: '2ème Censeur', name: 'Hulerich' },
        ]
    },
    {
        cycle: 'Cycle 3 (2022-2023)',
        members: [
            { role: 'Président', name: 'Paola' },
            { role: 'Secrétaire Général', name: 'Adam' },
            { role: 'Trésorier', name: 'Marcell' },
            { role: 'Commissaire aux Comptes', name: 'Daniel' },
            { role: '1er Censeur', name: 'Yvan' },
            { role: '2ème Censeur', name: 'Boris' },
        ]
    },
];

// Galerie photos (placeholders)
const PHOTO_GALLERY = [
    {
        id: 1,
        title: 'Photo de Groupe - Cycle 6',
        date: 'Février 2026',
        description: 'Lancement du Cycle 6',
        placeholder: '📸'
    },
    {
        id: 2,
        title: 'Réunion Mensuelle',
        date: 'Janvier 2026',
        description: 'Première réunion de l\'année',
        placeholder: '👥'
    },
    {
        id: 3,
        title: 'Célébration Fin Cycle 5',
        date: 'Décembre 2025',
        description: 'Clôture réussie du Cycle 5',
        placeholder: '🎉'
    },
    {
        id: 4,
        title: 'Projet Immobilier',
        date: 'Novembre 2025',
        description: 'Visite du terrain collectif',
        placeholder: '🏗️'
    },
    {
        id: 5,
        title: 'Assemblée Générale',
        date: 'Octobre 2025',
        description: 'AG annuelle - Bilan et perspectives',
        placeholder: '📊'
    },
    {
        id: 6,
        title: 'Événement Solidarité',
        date: 'Septembre 2025',
        description: 'Soutien à un membre',
        placeholder: '❤️'
    },
];

export default function Organization() {
    const [activeTab, setActiveTab] = useState<'current' | 'history' | 'gallery'>('current');

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
                <button
                    onClick={() => setActiveTab('gallery')}
                    className={`btn ${activeTab === 'gallery' ? 'btn-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    <ImageIcon className="mr-2" size={18} /> Galerie
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

            {/* Galerie Photos */}
            {activeTab === 'gallery' && (
                <div>
                    <div className="glass-card mb-6 bg-blue-500/10 border-blue-500/30">
                        <p className="text-sm text-blue-200 flex items-center gap-2">
                            <ImageIcon size={16} />
                            <span>La galerie sera bientôt enrichie avec vos photos d'événements. Pour l'instant, voici les événements marquants.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PHOTO_GALLERY.map((photo) => (
                            <div key={photo.id} className="glass-card group hover:bg-white/10 transition-all cursor-pointer">
                                {/* Placeholder Image */}
                                <div className="aspect-video bg-gradient-to-br from-purple-900/40 to-cyan-900/40 rounded-xl mb-4 flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-colors">
                                    <span className="text-6xl filter drop-shadow-lg">{photo.placeholder}</span>
                                </div>

                                {/* Photo Info */}
                                <div>
                                    <h3 className="font-semibold text-white mb-1">{photo.title}</h3>
                                    <p className="text-xs text-cyan-300 mb-2">{photo.date}</p>
                                    <p className="text-sm text-slate-400">{photo.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Upload Section (Future) */}
                    <div className="glass-card mt-6 text-center border-dashed border-2 border-white/20 bg-white/5">
                        <ImageIcon className="mx-auto mb-3 text-slate-400" size={32} />
                        <p className="text-slate-300 mb-2">Vous avez des photos à partager ?</p>
                        <p className="text-sm text-slate-500 mb-4">Contactez le Secrétaire Général pour ajouter vos photos</p>
                        <button className="btn btn-secondary">
                            <Mail size={16} className="mr-2" />
                            Envoyer des photos
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
