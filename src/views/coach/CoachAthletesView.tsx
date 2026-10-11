import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  TrendingUp, 
  X, 
  Sparkles, 
  Lock, 
  Unlock 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserProfile } from '../../types';

interface CoachAthletesViewProps {
  onNavigateTab: (tab: string) => void;
}

export const CoachAthletesView: React.FC<CoachAthletesViewProps> = ({ onNavigateTab }) => {
  const { allClients, toggleStudentManualAccess } = useAuth();
  const { setSelectedAthleteId } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredClients = allClients.filter(c => {
    return c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleToggleAccess = async (client: UserProfile) => {
    const isCurrentlyActive = client.subscriptionStatus === 'active' || client.isManuallyUnlocked;
    const newUnlock = !isCurrentlyActive;
    await toggleStudentManualAccess(client.uid, newUnlock);
    
    setActionFeedback(newUnlock
      ? `Acesso ativado para ${client.displayName}.`
      : `Acesso bloqueado para ${client.displayName}.`
    );
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleOpenAthlete = (clientId: string) => {
    setSelectedAthleteId(clientId);
    onNavigateTab('reports');
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      
      {/* Feedback Toast */}
      {actionFeedback && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button 
            onClick={() => setActionFeedback(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Gestão de Atletas
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Estado de ativação e controlo de acesso dos alunos ({allClients.length} registados)
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar atleta..."
            className="w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Clean, spacious athlete list with only identity, active/blocked state and switch */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-neutral-800">
        {filteredClients.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Nenhum atleta encontrado para a pesquisa.
          </div>
        ) : (
          filteredClients.map((client) => {
            const isActive = client.subscriptionStatus === 'active' || client.isManuallyUnlocked;

            return (
              <div 
                key={client.uid}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition"
              >
                {/* Athlete identity */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={client.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={client.displayName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-neutral-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {client.displayName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 truncate">
                      {client.email}
                    </p>
                  </div>
                </div>

                {/* Right side: Only Activation State & Action Button */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Indicator */}
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span>{isActive ? 'Ativo' : 'Bloqueado'}</span>
                  </span>

                  {/* Toggle Button */}
                  <button
                    onClick={() => handleToggleAccess(client)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-slate-100 hover:bg-red-500/10 text-slate-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-neutral-700'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                    }`}
                    title={isActive ? 'Bloquear acesso do atleta' : 'Ativar acesso do atleta'}
                  >
                    {isActive ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Bloquear</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Ativar</span>
                      </>
                    )}
                  </button>

                  {/* Open / Relatório */}
                  <button
                    onClick={() => handleOpenAthlete(client.uid)}
                    className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-black dark:text-amber-400 transition"
                    title="Ver Relatórios"
                  >
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
