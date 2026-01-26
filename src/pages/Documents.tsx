import { FileText, ExternalLink } from 'lucide-react';

export default function Documents() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-10 text-white drop-shadow-lg text-center">Documents & Archives</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {/* Dossier Cycle en cours */}
                <a
                    href="https://drive.google.com/drive/folders/1JGj7cAzTn_OjNZibQ6qt1WV1zXrTBlEC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card flex flex-col items-center justify-center p-8 gap-4 group hover:bg-white/10 transition-all hover:scale-105 cursor-pointer text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all">
                        <FileText size={32} className="text-purple-300" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Cycle en cours</h2>
                        <p className="text-sm text-slate-400">Règlement intérieur, PV, Statuts</p>
                    </div>
                    <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1">
                        Accéder au Drive <ExternalLink size={12} />
                    </span>
                </a>

                {/* Suivi Financier */}
                <a
                    href="https://genes-my.sharepoint.com/:x:/g/personal/dnkameni_ensae_fr/EWzouHh7cUpDpnb0pI9Gf4cBI5wxvbuitmtN0ZWPN1zV4g"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card flex flex-col items-center justify-center p-8 gap-4 group hover:bg-white/10 transition-all hover:scale-105 cursor-pointer text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all">
                        <FileText size={32} className="text-cyan-300" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Suivi Financier</h2>
                        <p className="text-sm text-slate-400">Suivi des réunions et cotisations</p>
                    </div>
                    <div className="mt-2 flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                            Accéder au Fichier <ExternalLink size={12} />
                        </span>
                        <span className="text-[10px] py-1 px-2 rounded bg-white/5 border border-white/10 text-slate-300">
                            Mdp : <span className="text-white font-mono font-bold">CEPEA237</span>
                        </span>
                    </div>
                </a>

                {/* Livret Epargne Populaire */}
                <a
                    href="https://drive.google.com/drive/folders/1g1zgK33KEPY7fmQg0c4Iy0C4Hdy7RSwj?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card flex flex-col items-center justify-center p-8 gap-4 group hover:bg-white/10 transition-all hover:scale-105 cursor-pointer text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] group-hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all">
                        <FileText size={32} className="text-green-300" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Livret Épargne</h2>
                        <p className="text-sm text-slate-400">Documents et suivi épargne populaire</p>
                    </div>
                    <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-green-300 flex items-center gap-1">
                        Accéder au Drive <ExternalLink size={12} />
                    </span>
                </a>
            </div>
        </div>
    );
}
