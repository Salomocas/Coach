import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  TrendingUp, 
  Dumbbell, 
  UtensilsCrossed, 
  MessageSquare, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Scale,
  Ruler,
  Target
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const activeCount = allClients.filter(c => c.subscriptionStatus === 'active' || c.isManuallyUnlocked).length;
  const blockedCount = allClients.length - activeCount;

  const filteredClients = allClients.filter(c => {
    const isClientActive = c.subscriptionStatus === 'active' || c.isManuallyUnlocked;
    const matchesSearch = c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && isClientActive) ||
                          (statusFilter === 'blocked' && !isClientActive);
    return matchesSearch && matchesStatus;
  });

  const handleToggleAccess = async (client: UserProfile) => {
    const isCurrentlyActive = client.subscriptionStatus === 'active' || client.isManuallyUnlocked;
    const newUnlock = !isCurrentlyActive;
    await toggleStudentManualAccess(client.uid, newUnlock);
    
    setActionFeedback(newUnlock
      ? `Acesso desbloqueado com sucesso para ${client.displayName}! O aluno está agora ativo.`
      : `Acesso bloqueado para ${client.displayName}. O aluno está impedido de aceder às rotinas.`
    );
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleGoToReports = (clientId: string) => {
    setSelectedAthleteId(clientId);
    onNavigateTab('reports');
  };

  const handleGoToWorkouts = (clientId: string) => {
    setSelectedAthleteId(clientId);
    onNavigateTab('workouts');
  };

  const handleGoToDiet = (clientId: string) => {
    setSelectedAthleteId(clientId);
    onNavigateTab('diet');
  };

  const handleGoToChat = (clientId: string) => {
    setSelectedAthleteId(clientId);
    onNavigateTab('chat');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast feedback */}
      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button 
            onClick={() => setActionFeedback(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            Painel do Treinador
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Gestão de Atletas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
            Verificação rápida de estado (ativo ou bloqueado), resumo de objetivos, peso e altura atual.
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-600 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 px-3 py-1.5 rounded-xl shadow-sm">
            Total: <strong className="text-slate-900 dark:text-white">{allClients.length}</strong>
          </span>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-sm">
            Ativos: <strong>{activeCount}</strong>
          </span>
          <span className="text-xs font-mono text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-xl shadow-sm">
            Bloqueados: <strong>{blockedCount}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome ou email..."
            className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Todos ({allClients.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'active'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-emerald-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Ativos ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('blocked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'blocked'
                ? 'bg-red-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-red-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Bloqueados ({blockedCount})
          </button>
        </div>
      </div>

      {/* Athletes List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200 dark:border-neutral-800 shadow-sm">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700 dark:text-neutral-300">Nenhum atleta encontrado.</p>
            <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">Experimenta alterar o termo de pesquisa ou os filtros de estado.</p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const isActive = client.subscriptionStatus === 'active' || client.isManuallyUnlocked;
            const weight = client.currentWeightKg || client.initialWeightKg || 75;
            const height = client.heightCm || 175;
            const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);

            return (
              <div 
                key={client.uid}
                className={`bg-white dark:bg-neutral-900 border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
                  isActive 
                    ? 'border-slate-200 dark:border-neutral-800' 
                    : 'border-red-300 dark:border-red-900/60 bg-red-500/[0.02]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  
                  {/* Left: Athlete Identity & Status */}
                  <div className="flex items-start gap-4 min-w-0 lg:w-1/3">
                    <img
                      src={client.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={client.displayName}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-neutral-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                          {client.displayName}
                        </h3>
                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {isActive ? 'Ativo' : 'Bloqueado'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-neutral-400 truncate mt-0.5">
                        {client.email}
                      </p>

                      <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1">
                        Plano: <span className="font-medium text-slate-700 dark:text-neutral-300">{client.subscriptionPlan || 'Acompanhamento Regular'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Center: Weight, Height & Goals */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-5/12 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-neutral-800/80 pt-4 lg:pt-0 lg:pl-6">
                    {/* Measurements */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-neutral-500 flex items-center gap-1">
                        <Scale className="w-3 h-3 text-amber-500" />
                        Medidas do Perfil
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 dark:bg-neutral-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-neutral-800">
                          <span className="text-[10px] text-slate-400 dark:text-neutral-500 block">Peso Atual</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{weight} kg</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-neutral-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-neutral-800">
                          <span className="text-[10px] text-slate-400 dark:text-neutral-500 block">Altura</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{height} cm</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-neutral-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-neutral-800">
                          <span className="text-[10px] text-slate-400 dark:text-neutral-500 block">IMC</span>
                          <span className="text-xs font-bold text-amber-500 font-mono">{bmi}</span>
                        </div>
                      </div>
                    </div>

                    {/* Goal summary */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-neutral-500 flex items-center gap-1">
                        <Target className="w-3 h-3 text-amber-500" />
                        Objetivo Principal
                      </span>
                      <p className="text-xs text-slate-700 dark:text-neutral-300 font-medium bg-slate-50 dark:bg-neutral-950 p-2 rounded-xl border border-slate-200 dark:border-neutral-800 line-clamp-2">
                        {client.goals || 'Recomposição corporal e aumento de tónus muscular.'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quick Actions & Status Toggle */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 lg:w-1/4 justify-start lg:justify-end border-t lg:border-t-0 border-slate-100 dark:border-neutral-800/80 pt-4 lg:pt-0">
                    {/* View Reports Button */}
                    <button
                      onClick={() => handleGoToReports(client.uid)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition flex items-center gap-1.5 shadow-sm shadow-amber-500/10 cursor-pointer"
                      title="Ver relatórios de evolução e registos deste atleta"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Relatório</span>
                    </button>

                    {/* Direct Toggle Active/Blocked Button */}
                    <button
                      onClick={() => handleToggleAccess(client)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                      }`}
                      title={isActive ? 'Bloquear acesso do atleta' : 'Ativar e desbloquear acesso do atleta'}
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

                    {/* Quick navigation icons */}
                    <div className="flex items-center gap-1 ml-auto lg:ml-0">
                      <button
                        onClick={() => handleGoToWorkouts(client.uid)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-neutral-700 transition"
                        title="Ver/atribuir treinos"
                      >
                        <Dumbbell className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleGoToDiet(client.uid)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-neutral-700 transition"
                        title="Ver/atribuir plano alimentar"
                      >
                        <UtensilsCrossed className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleGoToChat(client.uid)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-neutral-700 transition"
                        title="Abrir chat com o aluno"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
