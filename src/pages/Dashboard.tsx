import { Calendar, CheckCircle, Clock, Banknote } from 'lucide-react';

const MEMBERS = ['Marcell', 'Paola', 'Adam', 'Daniel', 'Yvan', 'Boris', 'Hulerich', 'Silvère'];
const START_MONTH = 1; // Février (0-indexed)
const START_YEAR = 2026;

// --- Utilitaires Dates ---
function getFirstSunday(year: number, month: number) {
    const date = new Date(year, month, 1);
    while (date.getDay() !== 0) { // 0 = Dimanche
        date.setDate(date.getDate() + 1);
    }
    return date;
}

function getNextMeetingDate() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // 1er Dimanche du mois actuel
    const meetingThisMonth = getFirstSunday(currentYear, currentMonth);
    // On met la réunion à 14h30 pour comparer correctement si c'est passé dans la journée
    meetingThisMonth.setHours(14, 30, 0, 0);

    if (now < meetingThisMonth) {
        return meetingThisMonth;
    } else {
        // Sinon c'est le mois prochain
        const meetingNextMonth = getFirstSunday(currentYear, currentMonth + 1);
        meetingNextMonth.setHours(14, 30, 0, 0);
        return meetingNextMonth;
    }
}

// Date de référence pour la logique (Mois de la prochaine réunion)
const NEXT_MEETING = getNextMeetingDate();
const REFERENCE_DATE = NEXT_MEETING;

// Génération du planning (Blocs de 3 mois)
const SCHEDULE = MEMBERS.map((member, index) => {
    // Calcul du mois de début pour ce membre (index * 3 mois)
    const offsetMonths = index * 3;
    const startDate = new Date(START_YEAR, START_MONTH + offsetMonths, 1);
    const endDate = new Date(START_YEAR, START_MONTH + offsetMonths + 2, 1); // +2 car inclusive

    const startMonthStr = startDate.toLocaleDateString('fr-FR', { month: 'long', year: (startDate.getFullYear() !== endDate.getFullYear() ? 'numeric' : undefined) }).toUpperCase();
    const endMonthStr = endDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase();

    // Année affichée seulement à la fin pour alléger, sauf si chevauchement (géré par format)
    const label = `${startMonthStr} - ${endMonthStr} `;

    // Logique temporelle basée sur la REFERENCE_DATE (Prochaine Réunion)
    const currentAbsoluteMonth = REFERENCE_DATE.getFullYear() * 12 + REFERENCE_DATE.getMonth();
    const startAbsoluteMonth = startDate.getFullYear() * 12 + startDate.getMonth();
    const endAbsoluteMonth = endDate.getFullYear() * 12 + endDate.getMonth();

    let status = 'future';
    let amount = 0;

    if (currentAbsoluteMonth > endAbsoluteMonth) {
        status = 'past';
        amount = 7000;
    } else if (currentAbsoluteMonth >= startAbsoluteMonth && currentAbsoluteMonth <= endAbsoluteMonth) {
        status = 'current';
        // Calcul progressif basique (1/3, 2/3, Full)
        const monthIndexInBlock = currentAbsoluteMonth - startAbsoluteMonth;
        amount = Math.floor((7000 / 3) * (monthIndexInBlock + 1));
        if (monthIndexInBlock === 2) amount = 7000;

    } else {
        status = 'future';
        amount = 0;
    }

    // Formatage montant
    const amountStr = amount.toLocaleString('fr-FR').replace(/\s/g, ' ');

    return { member, label, status, amount: amountStr, startDate };
});


export default function Dashboard() {
    const nextMeetingStr = NEXT_MEETING.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' });

    return (
        <div className="pb-10">
            <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-md">Tableau de Bord</h1>

            {/* Indicateurs Clés */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="glass-card flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold mb-1 text-slate-400 uppercase tracking-wider">Prochaine Réunion</h2>
                        <p className="text-3xl font-bold text-white capitalize">{nextMeetingStr}</p>
                        <p className="text-xs text-cyan-300 mt-1 flex items-center gap-1"><Clock size={12} /> 14h30 précise</p>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        <Calendar className="text-purple-400" />
                    </div>
                </div>
                <div className="glass-card">
                    <h2 className="text-sm font-semibold mb-3 text-slate-400 uppercase tracking-wider">Cotisations Tontine</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-300">Avant réception</span>
                            <span className="font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">313 €</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-300">Après réception</span>
                            <span className="font-bold text-green-300 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">331 €</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progression Tontine */}
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                🏆 Progression Tontine (Cycle 6)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SCHEDULE.map((item, index) => (
                    <div
                        key={index}
                        className={`
                            relative overflow-hidden p-6 rounded-2xl border transition-all duration-300
                            ${item.status === 'current'
                                ? 'bg-purple-900/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-105 z-10'
                                : item.status === 'past'
                                    ? 'bg-white/5 border-white/5 opacity-60 grayscale'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }
`}
                    >
                        {/* Header Carte */}
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/20 ${item.status === 'current' ? 'text-purple-300' : 'text-slate-400'} `}>
                                {item.label}
                            </span>
                            {item.status === 'past' && <CheckCircle size={20} className="text-green-500" />}
                            {item.status === 'current' && <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                            </span>}
                        </div>

                        {/* Info Membre */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-slate-900 ${item.status === 'current' ? 'bg-purple-400 text-white' : 'bg-slate-700 text-slate-300'} `}>
                                {item.member.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase">Bénéficiaire</p>
                                <p className={`font-bold text-xl ${item.status === 'current' ? 'text-white' : 'text-slate-200'} `}>{item.member}</p>
                            </div>
                        </div>

                        {/* Cagnotte */}
                        <div className={`p-3 rounded-xl flex items-center justify-between border ${item.status === 'current' ? 'bg-purple-500/10 border-purple-500/30' : 'bg-black/20 border-white/5'} `}>
                            <div className="flex items-center gap-2">
                                <Banknote size={16} className={item.status === 'past' ? 'text-green-400' : 'text-slate-400'} />
                                <span className="text-sm text-slate-300">Cagnotte</span>
                            </div>
                            <span className={`font-bold font-mono ${item.status === 'past' ? 'text-green-400' : item.status === 'current' ? 'text-purple-300' : 'text-slate-500'} `}>
                                {item.amount} €
                            </span>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
