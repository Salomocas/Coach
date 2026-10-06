import React from 'react';
import { 
  Users, 
  Dumbbell, 
  CreditCard, 
  TrendingUp, 
  MessageSquare, 
  CalendarPlus, 
  UtensilsCrossed, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Flame,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface CoachDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ onNavigateTab }) => {
  const { allClients } = useAuth();
  const { exercises, workoutPlans, messages, setSelectedAthleteId } = useData();

  const activeClients = allClients.filter(c => c.subscriptionStatus === 'active');
  const expiredClients = allClients.filter(c => c.subscriptionStatus !== 'active');
  const unreadMessagesCount = messages.filter(m => m.senderRole === 'client' && !m.read).length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                Painel do Treinador Sérgio Cunha
              </span>
              <span className="text-xs text-neutral-400">Temporada 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Olá, Coach Sérgio!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-xl leading-relaxed">
              Todos os teus atletas têm planos ativos e monitorizados. Tens <strong className="text-amber-400">{unreadMessagesCount} mensagens pendentes</strong> e <strong className="text-white">{activeClients.length} atletas</strong> com acompanhamento VIP ativo.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('builder-workout')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Criar Novo Treino</span>
            </button>
            <button
              onClick={() => onNavigateTab('builder-nutrition')}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-2 border border-neutral-700 transition"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Prescrever Ementa</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => onNavigateTab('athletes')}
          className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 cursor-pointer transition shadow-md group"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Atletas Sob Acompanhamento</span>
            <Users className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{allClients.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">{activeClients.length} ativos</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>100% aderência às rotinas</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('exercises')}
          className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 cursor-pointer transition shadow-md group"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Biblioteca de Exercícios</span>
            <Dumbbell className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{exercises.length}</span>
            <span className="text-xs text-neutral-400">variáveis com vídeo</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Reutilizáveis nos planos</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('chat')}
          className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 cursor-pointer transition shadow-md group"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Mensagens & Dúvidas</span>
            <MessageSquare className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{messages.length}</span>
            {unreadMessagesCount > 0 && (
              <span className="text-xs text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/10">
                {unreadMessagesCount} não lidas
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Canal direto com alunos</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('athletes')}
          className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 cursor-pointer transition shadow-md group"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Faturação Mensal (MRR)</span>
            <CreditCard className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {activeClients.length * 49} €
            </span>
            <span className="text-xs text-neutral-400">/mês</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center justify-between">
            <span>Gestão de subscrições</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
          </div>
        </div>

      </div>

      {/* Athletes Quick List and Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Athletes List */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Atletas Acompanhados Recentemente</h3>
              <p className="text-xs text-neutral-400">Clica num atleta para aceder ao histórico de cargas e avaliações</p>
            </div>
            <button
              onClick={() => onNavigateTab('athletes')}
              className="text-xs text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1"
            >
              <span>Ver Todos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {allClients.map((client) => {
              const isActive = client.subscriptionStatus === 'active';
              return (
                <div
                  key={client.uid}
                  onClick={() => {
                    setSelectedAthleteId(client.uid);
                    onNavigateTab('athletes');
                  }}
                  className="p-4 rounded-2xl bg-neutral-950/70 hover:bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={client.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                      alt={client.displayName}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-neutral-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{client.displayName}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {isActive ? 'Ativo' : 'Pendente'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{client.goals}</p>
                    </div>
                  </div>

                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-mono font-bold text-white">
                      {client.currentWeightKg || client.initialWeightKg} kg
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      Início: {client.initialWeightKg} kg
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coach Quick Shortcuts & Tips */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Ações Rápidas do Coach</span>
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Atalhos para otimizar o fluxo de trabalho semanal.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigateTab('exercises')}
                className="w-full text-left p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-white transition text-xs flex items-center justify-between"
              >
                <span>➕ Adicionar Novo Exercício à Biblioteca</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              </button>
              <button
                onClick={() => onNavigateTab('builder-nutrition')}
                className="w-full text-left p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-white transition text-xs flex items-center justify-between"
              >
                <span>📋 Aplicar Template de Dieta Rápido</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              </button>
              <button
                onClick={() => onNavigateTab('chat')}
                className="w-full text-left p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-white transition text-xs flex items-center justify-between"
              >
                <span>💬 Responder a Dúvidas de Atletas</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
            <span className="text-[11px] text-neutral-500 block">
              Coach Sérgio Cunha • Treinador Certificado
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
