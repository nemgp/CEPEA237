import { useState } from 'react';
import { FileText, ExternalLink, BookOpen, ChevronDown, ChevronRight, Home, Users, Wallet, Heart, FileText as FileIcon, Shield, Lock, Smartphone, HelpCircle, Phone } from 'lucide-react';

export default function Documents() {
    const [expandedSections, setExpandedSections] = useState<string[]>(['navigation']);

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const isExpanded = (section: string) => expandedSections.includes(section);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white">Documents & Archives</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

            {/* User Guide Section */}
            <div className="glass-card">
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={24} className="text-orange-300" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">📖 Guide d'Utilisation du Portail</h2>
                        <p className="text-slate-400">
                            Découvrez comment utiliser toutes les fonctionnalités du portail CEPEA237
                        </p>
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleSection('navigation')}
                        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Home className="text-purple-400" size={20} />
                            <span className="font-semibold text-white">Navigation dans le Portail</span>
                        </div>
                        {isExpanded('navigation') ? <ChevronDown className="text-slate-400" size={20} /> : <ChevronRight className="text-slate-400" size={20} />}
                    </button>
                    {isExpanded('navigation') && (
                        <div className="mt-3 p-4 bg-white/5 rounded-lg space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    <Home size={16} className="text-purple-400" /> Dashboard
                                </h4>
                                <ul className="text-slate-400 space-y-1 ml-6 list-disc">
                                    <li>Vue d'ensemble de la tontine</li>
                                    <li>Statistiques clés (prêts, épargnes, soutiens)</li>
                                    <li>Activités récentes</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    <Users size={16} className="text-blue-400" /> Organisation
                                </h4>
                                <ul className="text-slate-400 space-y-1 ml-6 list-disc">
                                    <li>Bureau Actuel : Composition du Cycle 6</li>
                                    <li>Historique : Bureau du Cycle 5</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    <Wallet size={16} className="text-green-400" /> Finances
                                </h4>
                                <ul className="text-slate-400 space-y-1 ml-6 list-disc">
                                    <li><strong className="text-white">Prêts :</strong> Consulter, filtrer et rechercher les prêts</li>
                                    <li><strong className="text-white">Épargnes :</strong> Suivre les dépôts et retraits</li>
                                    <li><strong className="text-cyan-400">Bureau :</strong> Créer, modifier et supprimer</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    <Heart size={16} className="text-red-400" /> Secours & Assistance
                                </h4>
                                <ul className="text-slate-400 space-y-1 ml-6 list-disc">
                                    <li>👶 Naissance : 750 € (50%)</li>
                                    <li>💍 Mariage : 1 500 € (100%)</li>
                                    <li>🏥 Hospitalisation : 375 € (25%)</li>
                                    <li>⚰️ Perte grave : 1 500 € (100%)</li>
                                </ul>
                                <p className="text-xs text-slate-500 mt-2 ml-6">Assiette de cotisation : 1 500 €</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Administration Section */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleSection('admin')}
                        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Shield className="text-purple-400" size={20} />
                            <span className="font-semibold text-white">Fonctionnalités d'Administration</span>
                            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">Bureau uniquement</span>
                        </div>
                        {isExpanded('admin') ? <ChevronDown className="text-slate-400" size={20} /> : <ChevronRight className="text-slate-400" size={20} />}
                    </button>
                    {isExpanded('admin') && (
                        <div className="mt-3 p-4 bg-white/5 rounded-lg space-y-3 text-sm">
                            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                                <p className="text-purple-200 text-xs mb-2">
                                    <strong>Réservé aux membres du bureau :</strong> Président, Secrétaire Général, Trésorier
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2">Gestion Financière</h4>
                                <ul className="text-slate-400 space-y-1 ml-6 list-disc">
                                    <li>Créer, modifier et supprimer des prêts</li>
                                    <li>Enregistrer les dépôts et retraits d'épargne</li>
                                    <li>Gérer l'historique des soutiens</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2">Réinitialisation des Mots de Passe</h4>
                                <p className="text-slate-400 ml-6">
                                    Accessible via <strong className="text-white">Administration → Réinitialiser mots de passe</strong>
                                </p>
                                <ul className="text-slate-400 space-y-1 ml-6 list-disc mt-2">
                                    <li>Consulter la liste de tous les utilisateurs</li>
                                    <li>Voir la date du dernier changement de mot de passe</li>
                                    <li>Réinitialiser le mot de passe d'un membre</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Security Section */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleSection('security')}
                        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Lock className="text-green-400" size={20} />
                            <span className="font-semibold text-white">Sécurité et Compte</span>
                        </div>
                        {isExpanded('security') ? <ChevronDown className="text-slate-400" size={20} /> : <ChevronRight className="text-slate-400" size={20} />}
                    </button>
                    {isExpanded('security') && (
                        <div className="mt-3 p-4 bg-white/5 rounded-lg space-y-3 text-sm">
                            <div>
                                <h4 className="font-semibold text-white mb-2">Changer votre Mot de Passe</h4>
                                <ol className="text-slate-400 space-y-1 ml-6 list-decimal">
                                    <li>Cliquez sur "Changer mon mot de passe" dans le menu</li>
                                    <li>Entrez votre mot de passe actuel</li>
                                    <li>Saisissez votre nouveau mot de passe (min. 6 caractères)</li>
                                    <li>Confirmez le nouveau mot de passe</li>
                                    <li>Cliquez sur "Changer le mot de passe"</li>
                                </ol>
                                <p className="text-xs text-green-400 mt-2 ml-6">
                                    💡 Changez votre mot de passe tous les 3-6 mois
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2">Déconnexion</h4>
                                <p className="text-slate-400 ml-6">
                                    Cliquez sur le bouton rouge "Déconnexion" en bas du menu latéral
                                </p>
                                <p className="text-xs text-orange-400 mt-1 ml-6">
                                    ⚠️ Déconnectez-vous toujours sur un ordinateur partagé
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Section */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleSection('mobile')}
                        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Smartphone className="text-cyan-400" size={20} />
                            <span className="font-semibold text-white">Utilisation Mobile</span>
                        </div>
                        {isExpanded('mobile') ? <ChevronDown className="text-slate-400" size={20} /> : <ChevronRight className="text-slate-400" size={20} />}
                    </button>
                    {isExpanded('mobile') && (
                        <div className="mt-3 p-4 bg-white/5 rounded-lg space-y-3 text-sm">
                            <p className="text-slate-400">
                                Le portail est entièrement responsive et optimisé pour les appareils mobiles.
                            </p>
                            <div>
                                <h4 className="font-semibold text-white mb-2">Navigation Mobile</h4>
                                <ul className="text-slate-400 space-y-1 ml-6 list-disc">
                                    <li>Appuyez sur le bouton menu ☰ en haut à gauche</li>
                                    <li>Toutes les fonctionnalités sont accessibles</li>
                                    <li>Les tableaux sont scrollables horizontalement</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2">Conseils</h4>
                                <ul className="text-slate-400 space-y-1 ml-6 list-disc">
                                    <li>Mode paysage pour les tableaux larges</li>
                                    <li>Formulaires adaptés automatiquement</li>
                                    <li>Boutons optimisés pour le tactile</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* FAQ Section */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleSection('faq')}
                        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <HelpCircle className="text-yellow-400" size={20} />
                            <span className="font-semibold text-white">Questions Fréquentes</span>
                        </div>
                        {isExpanded('faq') ? <ChevronDown className="text-slate-400" size={20} /> : <ChevronRight className="text-slate-400" size={20} />}
                    </button>
                    {isExpanded('faq') && (
                        <div className="mt-3 p-4 bg-white/5 rounded-lg space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-white mb-1">Comment voir mes propres transactions ?</h4>
                                <p className="text-slate-400 ml-4">
                                    Utilisez la barre de recherche dans Finances ou Secours pour filtrer par votre nom.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-1">Je ne vois pas les boutons pour créer/modifier</h4>
                                <p className="text-slate-400 ml-4">
                                    Ces fonctionnalités sont réservées aux membres du bureau. Contactez le Président si nécessaire.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-1">Les données sont-elles sécurisées ?</h4>
                                <p className="text-slate-400 ml-4">
                                    Oui, toutes les données sont stockées de manière sécurisée avec des contrôles d'accès stricts.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-1">Problème technique ?</h4>
                                <p className="text-slate-400 ml-4">
                                    Contactez un membre du bureau (Président, Secrétaire ou Trésorier).
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact Section */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleSection('contact')}
                        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Phone className="text-blue-400" size={20} />
                            <span className="font-semibold text-white">Support et Contact</span>
                        </div>
                        {isExpanded('contact') ? <ChevronDown className="text-slate-400" size={20} /> : <ChevronRight className="text-slate-400" size={20} />}
                    </button>
                    {isExpanded('contact') && (
                        <div className="mt-3 p-4 bg-white/5 rounded-lg text-sm">
                            <p className="text-slate-400 mb-3">
                                Pour toute question, assistance ou problème technique, contactez :
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="text-purple-400">👑</span>
                                    <strong>Président :</strong> Marcell
                                </div>
                                <div className="flex items-center gap-2 text-white">
                                    <span className="text-blue-400">📝</span>
                                    <strong>Secrétaire Général :</strong> Paola
                                </div>
                                <div className="flex items-center gap-2 text-white">
                                    <span className="text-green-400">💰</span>
                                    <strong>Trésorier :</strong> Daniel
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Best Practices */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        🎯 Bonnes Pratiques
                    </h3>
                    <ul className="text-sm text-slate-300 space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✅</span>
                            <span><strong>Sécurité :</strong> Ne partagez jamais votre mot de passe</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✅</span>
                            <span><strong>Déconnexion :</strong> Déconnectez-vous après chaque session</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✅</span>
                            <span><strong>Vérification :</strong> Vérifiez vos informations avant validation</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✅</span>
                            <span><strong>Régularité :</strong> Consultez le portail régulièrement</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✅</span>
                            <span><strong>Communication :</strong> Signalez toute erreur rapidement</span>
                        </li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <p className="text-slate-500 text-sm">
                        Version 1.0 • Cycle 6 • Janvier 2026
                    </p>
                    <p className="text-purple-400 font-semibold mt-2">
                        💜 CEPEA237 - Entraide • Partage • Évolution
                    </p>
                </div>
            </div>
        </div>
    );
}
