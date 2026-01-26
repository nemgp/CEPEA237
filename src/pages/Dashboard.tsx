export default function Dashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white drop-shadow-md">Tableau de Bord</h1>
            <div className="grid grid-cols-1 gap-6">
                <div className="glass-card">
                    <h2 className="text-lg font-semibold mb-2 text-slate-200">Prochaine Réunion</h2>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Dimanche 01 Fev</p>
                    <p className="text-sm text-slate-400">14h30 précise</p>
                </div>
                <div className="glass-card">
                    <h2 className="text-lg font-semibold mb-2 text-slate-200">Ma Cagnotte</h2>
                    <p className="text-4xl font-bold text-green-400 shadow-green-900/50 drop-shadow-lg">350 €</p>
                    <p className="text-sm text-slate-400">Épargne totale</p>
                </div>
            </div>
        </div>
    );
}
