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
    'Mairo': lion, // Reusing lion for Mairo
};

const bureau = [
    { role: 'Président', name: 'Marcell', color: 'bg-blue-100 text-blue-800' },
    { role: 'Secrétaire Général', name: 'Paola', color: 'bg-purple-100 text-purple-800' },
    { role: 'Commissaire aux Comptes', name: 'Adam', color: 'bg-green-100 text-green-800' },
    { role: 'Trésorier', name: 'Daniel', color: 'bg-yellow-100 text-yellow-800' },
    { role: '1er Censeur', name: 'Yvan', color: 'bg-red-100 text-red-800' },
    { role: '2ème Censeur', name: 'Boris', color: 'bg-red-50 text-red-600' },
    { role: 'Membre', name: 'Hulerich', color: 'bg-cyan-100 text-cyan-800' },
    { role: 'Membre ', name: 'Mairo', color: 'bg-indigo-100 text-indigo-800' },
    { role: 'Membre  ', name: 'Silvère', color: 'bg-pink-100 text-pink-800' },
];

export default function Organization() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white">Organisation - Cycle 6</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bureau.map((member) => (
                    <div key={member.role} className="glass-card flex items-center gap-4 hover:bg-white/10 transition-colors cursor-default">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-900 border-2 border-white/10">
                            <img
                                src={AVATAR_MAP[member.name]}
                                alt={member.name}
                                className={`w-full h-full object-cover ${member.name === 'Yvan' ? 'scale-125' : ''}`}
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-white">{member.name}</h3>
                            <p className="text-sm text-cyan-300">{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
